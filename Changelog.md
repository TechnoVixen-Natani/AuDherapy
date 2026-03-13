# Changelog

All notable changes to the AuDherapy project will be documented in this file.

## [1.1.0] - 2024-05-22
### Added
- **CSV Export Engine**: Replaced legacy print function with a lightweight spreadsheet generator.
- **Native Sharing**: Integrated `@capacitor/share` to allow reports to be sent directly to Email, Drive, or Messaging apps.
- **FileSystem Bridge**: Integrated `@capacitor/filesystem` for secure temporary storage of generated reports.
- **Enhanced Analytics**: Added "Forensic Stats" to exports, including Medication Adherence counts and Crisis event tracking.

### Fixed
- **Android Memory Crash**: Resolved a fatal error where calling `window.print()` in the APK caused a hardware overflow.
- **Data Readability**: Sanitized "garbled" database IDs for Voice and Video memos in exported documents.
- **Chart Rendering**: Improved the `generateMasterReport` logic to ensure charts are fully drawn before the export triggers.

### Security
- **Release Signing**: Implemented a dedicated Production KeyStore for official APK distribution.