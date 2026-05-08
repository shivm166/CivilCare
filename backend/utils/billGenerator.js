import { MaintenanceBill } from "../models/maintenance_bill.model.js";
import { MaintenanceRule } from "../models/maintenance_rule.model.js";
import { UserSocietyRel } from "../models/user_society_rel.model.js";
import { Unit } from "../models/unit.model.js";

/**
 * Generate maintenance bills for all members in a society
 * @param {String} societyId - Society ID
 * @param {Number} month - Billing month (1-12)
 * @param {Number} year - Billing year
 * @returns {Object} - Generated bills summary
 */
export const generateBillsForSociety = async (societyId, month, year) => {
  try {
    // Check if bills already exist for this period
    const existingBills = await MaintenanceBill.countDocuments({
      society: societyId,
      billingMonth: month,
      billingYear: year,
    });

    if (existingBills > 0) {
      throw new Error(`Bills already generated for ${month}/${year}`);
    }

    // Get all active maintenance rules for this society
    const rules = await MaintenanceRule.find({
      society: societyId,
      isActive: true,
    }).sort({ ruleType: -1 }); // building_specific first

    if (rules.length === 0) {
      throw new Error("No active maintenance rules found");
    }

    // Get all members with assigned units
    const members = await UserSocietyRel.find({
      society: societyId,
      isActive: true,
      unit: { $ne: null },
    }).populate({
      path: "unit",
      populate: { path: "building" },
    });

    if (members.length === 0) {
      throw new Error("No members with assigned units found");
    }

    const billsToCreate = [];
    const errors = [];

    for (const member of members) {
      try {
        const unit = member.unit;
        
        // Find applicable rule (building-specific takes precedence)
        let applicableRule = null;
        for (const rule of rules) {
          if (rule.appliesTo(unit)) {
            applicableRule = rule;
            break;
          }
        }

        if (!applicableRule) {
          errors.push({
            userId: member.user,
            unitId: unit._id,
            error: "No applicable maintenance rule found",
          });
          continue;
        }

        // Calculate amount
        const baseAmount = applicableRule.calculateAmount(unit);

        if (baseAmount <= 0) {
          errors.push({
            userId: member.user,
            unitId: unit._id,
            error: "Calculated amount is zero or negative",
          });
          continue;
        }

        // Calculate due date
        const billingDay = applicableRule.billingDay;
        const dueDays = applicableRule.dueDays;
        
        const billDate = new Date(year, month - 1, billingDay);
        const dueDate = new Date(billDate);
        dueDate.setDate(dueDate.getDate() + dueDays);

        // Create bill object
        billsToCreate.push({
          society: societyId,
          user: member.user,
          unit: unit._id,
          building: unit.building._id,
          maintenanceRule: applicableRule._id,
          billingMonth: month,
          billingYear: year,
          baseAmount,
          penaltyAmount: 0,
          totalAmount: baseAmount,
          billGeneratedDate: new Date(),
          dueDate,
          status: "pending",
          isPenaltyPaid: false,
          isMaintenancePaid: false,
          notificationSent: false,
        });
      } catch (error) {
        errors.push({
          userId: member.user,
          unitId: member.unit?._id,
          error: error.message,
        });
      }
    }

    // Bulk insert bills
    let createdBills = [];
    if (billsToCreate.length > 0) {
      createdBills = await MaintenanceBill.insertMany(billsToCreate);
    }

    return {
      success: true,
      billsGenerated: createdBills.length,
      errors: errors.length > 0 ? errors : undefined,
      month,
      year,
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Update penalty for overdue bills
 * @param {String} societyId - Society ID
 * @returns {Object} - Update summary
 */
export const updateOverdueBillsPenalty = async (societyId) => {
  try {
    const today = new Date();
    
    // Find all overdue bills
    const overdueBills = await MaintenanceBill.find({
      society: societyId,
      status: { $in: ["pending", "overdue", "partially_paid"] },
      dueDate: { $lt: today },
      isMaintenancePaid: false,
    }).populate("maintenanceRule");

    let updatedCount = 0;

    for (const bill of overdueBills) {
      if (!bill.maintenanceRule || !bill.maintenanceRule.penaltyEnabled) {
        continue;
      }

      const daysLate = Math.floor((today - bill.dueDate) / (1000 * 60 * 60 * 24));
      
      if (daysLate > 0) {
        const newPenalty = bill.maintenanceRule.calculatePenalty(
          bill.baseAmount,
          daysLate
        );

        if (newPenalty !== bill.penaltyAmount) {
          bill.penaltyAmount = newPenalty;
          bill.totalAmount = bill.baseAmount + newPenalty;
          bill.daysOverdue = daysLate;
          bill.status = "overdue";
          
          if (!bill.penaltyAppliedDate) {
            bill.penaltyAppliedDate = today;
          }

          await bill.save();
          updatedCount++;
        }
      }
    }

    return {
      success: true,
      billsUpdated: updatedCount,
    };
  } catch (error) {
    throw error;
  }
};
