export interface Translation {
  [key: string]: string;
}

export const translations = {
  en: {
    // App and Navigation
    appName: "Cyber Crime Management System",
    location: "Ahilyanagar",
    dashboard: "Dashboard",
    caseManagement: "Case Management", 
    evidenceAnalysis: "Evidence Analysis",
    aiTools: "AI Investigation Tools",
    victimSupport: "Victim Support",
    securitySettings: "Security Settings",
    masterConfig: "Master Configuration",
    
    // Dashboard
    activeCases: "Active Cases",
    resolvedToday: "Resolved Today",
    highPriority: "High Priority",
    aiDetections: "AI Detections",
    recentActivity: "Recent Activity",
    
    // Case Management
    newCase: "New Case",
    caseNumber: "Case Number",
    firNumber: "FIR Number",
    complaintType: "Complaint Type",
    status: "Status",
    priority: "Priority",
    assignedOfficer: "Assigned Officer",
    incidentDate: "Incident Date",
    locationField: "Location",
    description: "Description",
    
    // Crime Categories
    hacking: "Hacking",
    jobFraud: "Job Fraud",
    matrimonialFraud: "Matrimonial Fraud",
    ransomware: "Ransomware",
    phishing: "Phishing",
    identityTheft: "Identity Theft",
    financialFraud: "Financial Fraud",
    cyberStalking: "Cyber Stalking",
    onlineHarassment: "Online Harassment",
    dataBreach: "Data Breach",
    
    // Status and Priority
    pending: "Pending",
    investigating: "Under Investigation",
    resolved: "Resolved",
    closed: "Closed",
    low: "Low",
    medium: "Medium",
    high: "High",
    critical: "Critical",
    
    // Police Hierarchy
    sp: "Superintendent of Police",
    addlSp: "Additional SP",
    dysp: "Deputy Superintendent of Police", 
    inspector: "Police Inspector",
    asi: "Assistant Sub Inspector",
    headConstable: "Head Constable",
    constable: "Police Constable",
    
    // Actions
    create: "Create",
    edit: "Edit",
    delete: "Delete",
    save: "Save",
    cancel: "Cancel",
    submit: "Submit",
    view: "View",
    search: "Search",
    logout: "Logout",
    
    // Messages
    saveSuccess: "Saved successfully",
    unauthorized: "You are logged out. Logging in again...",
  },
  
  mr: {
    // App and Navigation - मराठी
    appName: "सायबर गुन्हे व्यवस्थापन प्रणाली",
    location: "अहिल्यानगर",
    dashboard: "डॅशबोर्ड",
    caseManagement: "खटला व्यवस्थापन",
    evidenceAnalysis: "पुरावा विश्लेषण", 
    aiTools: "कृत्रिम बुद्धिमत्ता तपास साधने",
    victimSupport: "पीडित सहायता",
    securitySettings: "सुरक्षा सेटिंग्ज",
    masterConfig: "मुख्य कॉन्फिगरेशन",
    
    // Dashboard
    activeCases: "सक्रिय खटले",
    resolvedToday: "आज सोडवले",
    highPriority: "उच्च प्राधान्य",
    aiDetections: "AI शोध",
    recentActivity: "अलीकडील क्रियाकलाप",
    
    // Case Management
    newCase: "नवीन खटला",
    caseNumber: "खटला क्रमांक",
    firNumber: "गुन्हा नोंदणी क्रमांक",
    complaintType: "तक्रारीचा प्रकार",
    status: "स्थिती",
    priority: "प्राधान्य",
    assignedOfficer: "नियुक्त अधिकारी",
    incidentDate: "घटना दिनांक",
    locationField: "स्थान",
    description: "वर्णन",
    
    // Crime Categories
    hacking: "हॅकिंग",
    jobFraud: "नोकरी फसवणूक",
    matrimonialFraud: "वैवाहिक फसवणूक",
    ransomware: "रॅन्समवेअर",
    phishing: "फिशिंग",
    identityTheft: "ओळख चोरी",
    financialFraud: "आर्थिक फसवणूक",
    cyberStalking: "सायबर पाठलाग",
    onlineHarassment: "ऑनलाइन छळवणूक",
    dataBreach: "डेटा उल्लंघन",
    
    // Status and Priority
    pending: "प्रलंबित",
    investigating: "तपासात",
    resolved: "निराकरण झाले",
    closed: "बंद",
    low: "कमी",
    medium: "मध्यम",
    high: "उच्च",
    critical: "गंभीर",
    
    // Police Hierarchy
    sp: "पोलीस अधीक्षक",
    addlSp: "अतिरिक्त पोलीस अधीक्षक",
    dysp: "उप पोलीस अधीक्षक",
    inspector: "पोलीस निरीक्षक",
    asi: "सहाय्यक उप निरीक्षक",
    headConstable: "मुख्य हवालदार",
    constable: "पोलीस हवालदार",
    
    // Actions
    create: "तयार करा",
    edit: "संपादित करा",
    delete: "हटवा",
    save: "जतन करा",
    cancel: "रद्द करा",
    submit: "सबमिट करा",
    view: "पहा",
    search: "शोधा",
    logout: "लॉग आउट",
    
    // Messages
    saveSuccess: "यशस्वीरित्या जतन केले",
    unauthorized: "तुम्ही लॉग आउट झाला आहात. पुन्हा लॉग इन होत आहे...",
  }
};

export type Language = 'en' | 'mr';

export function t(key: string, lang: Language = 'en'): string {
  const langTranslations = translations[lang] as Record<string, string>;
  const fallbackTranslations = translations.en as Record<string, string>;
  return langTranslations[key] || fallbackTranslations[key] || key;
}