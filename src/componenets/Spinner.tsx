import ClipLoader from "react-spinners/ClipLoader";

// Define the prop types for the Spinner component
interface SpinnerProps {
  loading: boolean;
}

const override = {
  display: "block",
  margin: "300px auto",
};

const Spinner: React.FC<SpinnerProps> = ({ loading }) => {
  return (
    <ClipLoader
      color="#000000"
      loading={loading}
      cssOverride={override}
      size={100}
    />
  );
};

export default Spinner;

