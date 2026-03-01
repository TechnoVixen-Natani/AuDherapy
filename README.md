# 🐾 AuDherapy v4.8 | Clinical Sensory & Health Log

### **A Human-AI Collaborative Project**
**Architect:** Natani Mayday/ TaskPuppy Loona  
**Collaborator:** Gemini (AI)  
### 🛠 [Click here for the Troubleshooting & PWA Guide](/TROUBLESHOOTING.md)
---

## **Project Vision**
AuDherapy was developed to bridge the gap between neurotypical health tracking and the high-precision needs of an **Autistic/AudHD** individual. Traditional apps often feature high-friction interfaces, sensory-overwhelming colors, and vague labels that do not account for literal interpretation or executive dysfunction.

This application is designed for **High-Precision Self-Management**, favoring technical consistency, objective data analysis, and a "sensory superpower" for identifying subtle physiological patterns.

---

## **Core Features**
* **🚨 Emergency Forensic Logic:** A high-visibility "Big Red Button" for logging Meltdowns/Shutdowns with a "Reboot Protocol" checklist.
* **📊 Color-Matched Analytics:** Real-time Daily Med Compliance and Catalyst Pie Charts that match the exact visual profile of the dashboard buttons.
* **🧤 Dynamic Sensory Suite:** One-tap logging for Noise, Light, Touch, and Smell sensitivities with custom "i" tooltips for literal definitions.
* **⚖️ Somatic Scaling:** 1-5 Capacity and 1-10 Physical Pain scales to maintain long-term data integrity for medical reporting (Daxson/Tyler).
* **🔒 Local-First Privacy:** Data is stored exclusively in the browser's `localStorage`. No cloud tracking, no third-party data mining.

---

## **Technical Philosophy & Collaboration**
This project serves as a case study in **Human-AI neuro-inclusion**. 

1.  **Transparency:** This app was built through a 1:1 collaborative process. The Human Architect provided the logical framework, sensory constraints, and UX requirements based on a successful 300lb weight-loss transformation and meticulous tracking discipline.
2.  **Logic-First Design:** Every feature is built to avoid "logical glitches." For example, the **50/10 productivity rule** and low-light setup are integrated into the core maintenance flow.
3.  **Scalability:** Version 4.8 introduces a "Sandbox" engine, allowing the user to customize, add, or delete buttons without breaking the underlying JavaScript math engine.

---

## **How to Use**
1.  **Log Daily:** Use the dashboard on the S24 Ultra to track core habits and system states.
2.  **Analyze:** Use the Analytics tab to identify correlations between sensory triggers and capacity levels.
3.  **Export:** Use the Data Vault to generate **Clinical CSV** or **JSON** backups for medical appointments.

---
*Developed with a "measure twice, cut once" philosophy to ensure technical precision and logical soundness.*
## [v6.12] - UI Optimization & Visual Hierarchy

### Added
* **Dynamic Grid Sizing:** Implemented a pure CSS layout rule (`:nth-child(odd):last-of-type`) to the `.grid-2` containers. Orphaned, odd-numbered buttons (such as in the Meds Quick-Log) now automatically span both columns to maintain strict visual symmetry without requiring underlying JavaScript modifications.
* **Sub-branding:** Added the slogan *"Forensic Tracking & System Regulation"* beneath the main application title to reinforce the tool's precise, objective purpose.

### Changed
* **Header Redesign:** Increased the primary "AuDherapy" title font size to `36px` to establish a clearer visual hierarchy at the top of the dashboard.
* **Header Layout Geometry:** Restructured the main `<h1>` block using nested flex containers. This ensures the title, the new slogan, and the right-aligned utility buttons (Edit/Analytics) maintain strict horizontal alignment and line-height consistency across various viewport sizes.
