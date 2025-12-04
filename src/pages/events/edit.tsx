import { useParams } from "react-router";
import Upsert from "../../components/Events/Upsert/Upsert";

const EditEventPage = () => {
  const { id } = useParams();
  return <Upsert mode="edit" eventId={id ?? ""} />;
};

export default EditEventPage;
