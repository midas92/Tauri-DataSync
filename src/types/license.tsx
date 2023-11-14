interface LicenseModal {
  closeModal: () => void;
  handleLicenseSubmit: () => void;
}
interface LicenseStatus {
  state: boolean;
}
export type { LicenseModal, LicenseStatus };
