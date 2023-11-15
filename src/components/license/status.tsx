import { LightMode } from "@mui/icons-material";
import { LicenseStatus } from "@/types/license";
import Alert from "./alert";

export default function Status(props: LicenseStatus) {
  return (
    <div className=" absolute top-8 right-16 flex items-center text-black">
      <Alert warn={props.alert.warn} message={props.alert.message}/>
      <span className="pr-4 text-2xl">License</span>
      <LightMode
        style={
          props.state
            ? { color: "rgb(30, 64, 175)" }
            : { color: "rgb(171, 177, 196)" }
        }
      />
    </div>
  );
}
