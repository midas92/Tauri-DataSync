import { LicenseModal } from "@/types/license";
import { useState } from "react";

export default function Modal(props: LicenseModal) {
  const [licenseKey, setLicenseKey] = useState("");
  const handleModalOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      props.closeModal();
    }
  };
  const submit = ()=> {
    localStorage.setItem("licensekey",licenseKey);
    props.handleLicenseSubmit();
  }
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 text-black"
      onClick={handleModalOverlayClick}
    >
      <div className="bg-white p-12 rounded-2xl w-1/3 ">
        <h2 className="text-3xl font-bold mb-1">Licence</h2>
        <div className="mb-6">
          <label className="block text-gray-700 font-bold py-2">License licence Key</label>
          <input
            type="text"
            placeholder="Type licence Key"
            className="border border-gray-300 px-4 py-2 w-full text-base"
            value={licenseKey}
            onChange={(e) => setLicenseKey(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <button
            type="button"
            className="bg-blue-800 text-white w-full px-12 py-2 rounded-md text-xl"
            onClick={submit}
          >
            Enter
          </button>
        </div>
      </div>
    </div>
  );
}
