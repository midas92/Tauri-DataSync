import { AlertProps } from "@/types/license";

export default function Alert(props: AlertProps) {
  return <div className={props.warn?"bg-red-600 text-white rounded-lg w-30 h-10 text-center flex items-center py-2 px-4  mr-4":" bg-sky-600 text-white rounded-lg w-30 h-10 text-center flex items-center mr-4 py-2 px-4"}><span>{props.message}</span></div>;
}
