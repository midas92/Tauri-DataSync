interface LicenseModal {
  closeModal: () => void;
  handleLicenseSubmit: () => void;
}
interface LicenseStatus {
  state: boolean;
  alert: AlertProps;
}

interface AlertProps {
  warn: boolean;
  message: string;
}
export type { LicenseModal, LicenseStatus, AlertProps };
