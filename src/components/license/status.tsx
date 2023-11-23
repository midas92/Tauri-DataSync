import { LightMode } from "@mui/icons-material";
import { LicenseStatus } from "@/types/license";
import Alert from "./alert";

export default function Status(props: LicenseStatus) {
  return (
    <div className=" absolute top-8 right-16 flex items-center text-black">
      <Alert warn={props.alert.warn} message={props.alert.message}/>
    </div>
  );
}
