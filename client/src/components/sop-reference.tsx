import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Book, Scale, Search } from "lucide-react";

const cybercrimeTypes = [
  {
    category: "hacking",
    title: "Hacking",
    description: "Unauthorized access to data in a system or computer",
    legalProvisions: ["ITA Sec 43", "ITA Sec 66"],
    subTypes: [
      "Social media accounts hacking",
      "Email account compromise",
      "Website defacement",
      "Unauthorized data access/breach"
    ],
    examples: "Classroom platform Seesaw hacked through credential stuffing attack"
  },
  {
    category: "job_fraud",
    title: "Job Fraud",
    description: "Deceiving persons seeking employment with false promises",
    legalProvisions: ["ITA Sec 66B", "ITA Sec 66C", "ITA Sec 66D"],
    subTypes: [
      "Fake job postings",
      "Work from home scams",
      "Part-time job fraud",
      "Training fee scams"
    ],
    examples: "Keepsharer app promising part-time jobs, collecting money from victims"
  },
  {
    category: "matrimonial_fraud",
    title: "Matrimonial Fraud",
    description: "Fake and misleading profiles on matrimonial websites",
    legalProvisions: ["ITA Sec 66B", "ITA Sec 66C", "ITA Sec 66D", "IPC 420", "IPC 471"],
    subTypes: [
      "Fake matrimonial profiles",
      "Financial extortion after befriending",
      "Identity misrepresentation",
      "Foreign national romance scams"
    ],
    examples: "African nationals using fake profiles to extort money from women"
  },
  {
    category: "ransomware",
    title: "Ransomware",
    description: "Malware that locks data until ransom payment is made",
    legalProvisions: ["ITA Sec 43", "ITA Sec 66"],
    subTypes: [
      "File encryption ransomware",
      "System lockout",
      "Cryptocurrency ransom demands",
      "Double extortion attacks"
    ],
    examples: "Former Canadian government employee ransomware affiliate sentenced to 20 years"
  },
  {
    category: "phishing",
    title: "Phishing",
    description: "Fraudulent attempts to obtain sensitive information",
    legalProvisions: ["ITA Sec 66", "ITA Sec 66C", "ITA Sec 66D"],
    subTypes: [
      "Email phishing",
      "SMS phishing (Smishing)",
      "Website spoofing",
      "Voice phishing (Vishing)"
    ],
    examples: "Fake banking websites collecting login credentials"
  },
  {
    category: "financial_fraud",
    title: "Financial Fraud",
    description: "Fraudulent financial transactions and schemes",
    legalProvisions: ["ITA Sec 66C", "ITA Sec 66D", "IPC 420"],
    subTypes: [
      "Online banking fraud",
      "Payment gateway fraud",
      "Investment scams",
      "Cryptocurrency fraud"
    ],
    examples: "UPI fraud, fake investment schemes, crypto ponzi schemes"
  }
];

const investigationStages = [
  {
    stage: "preliminary",
    title: "Preliminary Investigation",
    description: "Initial assessment and evidence collection",
    steps: [
      "Register FIR with proper cybercrime sections",
      "Collect basic evidence and victim statements",
      "Identify digital footprints",
      "Preserve volatile evidence"
    ]
  },
  {
    stage: "crime_scene",
    title: "Crime Scene Investigation",
    description: "Detailed digital crime scene analysis",
    steps: [
      "Secure digital devices and storage media",
      "Document network configurations",
      "Collect logs from servers and systems",
      "Interview technical witnesses"
    ]
  },
  {
    stage: "forensics",
    title: "Cyber Forensics",
    description: "Technical analysis of digital evidence",
    steps: [
      "Create forensic images of storage devices",
      "Analyze network traffic and logs",
      "Recover deleted files and communications",
      "Trace IP addresses and digital transactions"
    ]
  },
  {
    stage: "final_report",
    title: "Final Report Preparation",
    description: "Compilation of investigation findings",
    steps: [
      "Prepare comprehensive case report",
      "Document chain of custody",
      "Compile technical evidence",
      "Prepare court-ready documentation"
    ]
  }
];

export default function SOPReference() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Book className="h-5 w-5 text-primary" />
            <CardTitle>Cybercrime Standard Operating Procedures</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            Reference guide based on Generic Cybercrimes SOP (September 2022) for Indian law enforcement
          </p>
          
          <Tabs defaultValue="crimes" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="crimes">Crime Types</TabsTrigger>
              <TabsTrigger value="investigation">Investigation Stages</TabsTrigger>
              <TabsTrigger value="legal">Legal Provisions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="crimes" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cybercrimeTypes.map((crime) => (
                  <Card key={crime.category} className="border-l-4 border-l-primary">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{crime.title}</CardTitle>
                        <Badge variant="outline">{crime.category.replace('_', ' ')}</Badge>
                      </div>
                      <p className="text-sm text-gray-600">{crime.description}</p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <h5 className="font-medium text-sm mb-1">Legal Provisions:</h5>
                        <div className="flex flex-wrap gap-1">
                          {crime.legalProvisions.map((provision, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {provision}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="font-medium text-sm mb-1">Sub-types:</h5>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {crime.subTypes.map((subType, idx) => (
                            <li key={idx} className="flex items-center">
                              <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                              {subType}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="bg-blue-50 p-3 rounded-md">
                        <h5 className="font-medium text-sm mb-1 flex items-center">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Example:
                        </h5>
                        <p className="text-xs text-gray-700">{crime.examples}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="investigation" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {investigationStages.map((stage, idx) => (
                  <Card key={stage.stage} className="border-l-4 border-l-green-500">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{stage.title}</CardTitle>
                        <Badge className="bg-green-100 text-green-800">Stage {idx + 1}</Badge>
                      </div>
                      <p className="text-sm text-gray-600">{stage.description}</p>
                    </CardHeader>
                    <CardContent>
                      <h5 className="font-medium text-sm mb-2">Key Steps:</h5>
                      <ol className="text-sm text-gray-600 space-y-1">
                        {stage.steps.map((step, stepIdx) => (
                          <li key={stepIdx} className="flex items-start">
                            <span className="bg-primary text-white text-xs rounded-full w-4 h-4 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                              {stepIdx + 1}
                            </span>
                            {step}
                          </li>
                        ))}
                      </ol>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="legal" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Scale className="h-4 w-4 mr-2" />
                      Information Technology Act (ITA) 2000
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Badge className="mb-2">Section 43</Badge>
                      <p className="text-sm text-gray-600">
                        Penalty for damage to computer, computer system, etc. - Unauthorized access, data theft, virus introduction
                      </p>
                    </div>
                    <div>
                      <Badge className="mb-2">Section 66</Badge>
                      <p className="text-sm text-gray-600">
                        Computer related offences - Hacking with intent to cause wrongful loss or damage
                      </p>
                    </div>
                    <div>
                      <Badge className="mb-2">Section 66B</Badge>
                      <p className="text-sm text-gray-600">
                        Punishment for dishonestly receiving stolen computer resource or communication device
                      </p>
                    </div>
                    <div>
                      <Badge className="mb-2">Section 66C</Badge>
                      <p className="text-sm text-gray-600">
                        Punishment for identity theft - Fraudulent use of electronic signature, password or unique identification
                      </p>
                    </div>
                    <div>
                      <Badge className="mb-2">Section 66D</Badge>
                      <p className="text-sm text-gray-600">
                        Punishment for cheating by personation using computer resource
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Scale className="h-4 w-4 mr-2" />
                      Indian Penal Code (IPC) 1860
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Badge className="mb-2">Section 420</Badge>
                      <p className="text-sm text-gray-600">
                        Cheating and dishonestly inducing delivery of property
                      </p>
                    </div>
                    <div>
                      <Badge className="mb-2">Section 471</Badge>
                      <p className="text-sm text-gray-600">
                        Using as genuine a forged document or electronic record
                      </p>
                    </div>
                    <div>
                      <Badge className="mb-2">Section 120B</Badge>
                      <p className="text-sm text-gray-600">
                        Punishment of criminal conspiracy
                      </p>
                    </div>
                    <div>
                      <Badge className="mb-2">Section 34</Badge>
                      <p className="text-sm text-gray-600">
                        Acts done by several persons in furtherance of common intention
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="bg-yellow-50 border-yellow-200">
                <CardHeader>
                  <CardTitle className="text-yellow-800">Reporting Channels</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <h5 className="font-medium mb-1">Online Reporting</h5>
                      <p className="text-gray-600">National Cyber Crime Reporting Portal: cybercrime.gov.in</p>
                    </div>
                    <div>
                      <h5 className="font-medium mb-1">Helpline</h5>
                      <p className="text-gray-600">Cybercrime Helpline: 1930</p>
                    </div>
                    <div>
                      <h5 className="font-medium mb-1">Offline</h5>
                      <p className="text-gray-600">Local Police Station / Cyber Cell</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}