import { useSocietyWiseUserCount } from "../../hooks/api/useSocietyWiseUserCount";

const societyWiseCount = () => {
  const { data, isLoading } = useSocietyWiseUserCount();

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      {data?.data?.map((item) => (
        <p key={item.societyId}>
          {item.societyId}: {item.count} users
        </p>
      ))}
    </div>
  );
};
export default societyWiseCount;
