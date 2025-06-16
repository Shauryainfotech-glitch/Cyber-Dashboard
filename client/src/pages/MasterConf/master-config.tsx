import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Settings, Plus, Edit, Trash2, FileText, Database, Users, Shield } from "lucide-react";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import { queryClient } from "@/lib/queryClient";
import { FormConfiguration } from "@shared/schema";

export default function MasterConfig() {
  const [selectedForm, setSelectedForm] = useState("case_form");
  const [isAddFieldDialogOpen, setIsAddFieldDialogOpen] = useState(false);
  const [editingField, setEditingField] = useState<FormConfiguration | null>(null);

  const { data: formConfigs, isLoading } = useQuery({
    queryKey: ["/api/config/forms"],
  });

  const { data: currentFormFields } = useQuery({
    queryKey: ["/api/config/forms", selectedForm],
  });

  const addFieldMutation = useMutation({
    mutationFn: async (fieldData: Partial<FormConfiguration>) => {
      const response = await fetch("/api/config/forms/fields", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...fieldData, formType: selectedForm }),
      });
      if (!response.ok) throw new Error("Failed to add field");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/config/forms"] });
      setIsAddFieldDialogOpen(false);
    },
  });

  const updateFieldMutation = useMutation({
    mutationFn: async ({ id, ...fieldData }: Partial<FormConfiguration> & { id: number }) => {
      const response = await fetch(`/api/config/forms/fields/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fieldData),
      });
      if (!response.ok) throw new Error("Failed to update field");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/config/forms"] });
      setEditingField(null);
    },
  });

  const deleteFieldMutation = useMutation({
    mutationFn: async (fieldId: number) => {
      const response = await fetch(`/api/config/forms/fields/${fieldId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete field");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/config/forms"] });
    },
  });

  const formTypes = [
    { value: "case_form", label: "Case Registration Form", icon: FileText },
    { value: "complaint_form", label: "Complaint Form", icon: FileText },
    { value: "evidence_form", label: "Evidence Collection Form", icon: Database },
    { value: "victim_support_form", label: "Victim Support Form", icon: Users },
    { value: "threat_intelligence_form", label: "Threat Intelligence Form", icon: Shield },
  ];

  const fieldTypes = [
    { value: "text", label: "Text Input" },
    { value: "textarea", label: "Text Area" },
    { value: "select", label: "Dropdown Select" },
    { value: "multiselect", label: "Multi-Select" },
    { value: "checkbox", label: "Checkbox" },
    { value: "radio", label: "Radio Button" },
    { value: "date", label: "Date Picker" },
    { value: "datetime", label: "Date & Time" },
    { value: "number", label: "Number Input" },
    { value: "email", label: "Email Input" },
    { value: "phone", label: "Phone Number" },
    { value: "file", label: "File Upload" },
  ];

  const FieldFormDialog = ({ field = null, isOpen, onClose }: { 
    field?: FormConfiguration | null, 
    isOpen: boolean, 
    onClose: () => void 
  }) => {
    const [fieldData, setFieldData] = useState({
      fieldName: field?.fieldName || "",
      fieldLabel: field?.fieldLabel || "",
      fieldType: field?.fieldType || "text",
      isRequired: field?.isRequired || false,
      isVisible: field?.isVisible || true,
      displayOrder: field?.displayOrder || 0,
      fieldOptions: field?.fieldOptions || [],
      validation: field?.validation || {},
    });

    const handleSubmit = () => {
      if (field) {
        updateFieldMutation.mutate({ id: field.id, ...fieldData });
      } else {
        addFieldMutation.mutate(fieldData);
      }
    };

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{field ? "Edit Field" : "Add New Field"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Field Name (Technical)</Label>
                <Input
                  value={fieldData.fieldName}
                  onChange={(e) => setFieldData({ ...fieldData, fieldName: e.target.value })}
                  placeholder="e.g., suspect_name"
                />
              </div>
              <div>
                <Label>Field Label (Display)</Label>
                <Input
                  value={fieldData.fieldLabel}
                  onChange={(e) => setFieldData({ ...fieldData, fieldLabel: e.target.value })}
                  placeholder="e.g., Suspect Name"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Field Type</Label>
                <Select value={fieldData.fieldType} onValueChange={(value) => setFieldData({ ...fieldData, fieldType: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fieldTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Display Order</Label>
                <Input
                  type="number"
                  value={fieldData.displayOrder}
                  onChange={(e) => setFieldData({ ...fieldData, displayOrder: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            {(fieldData.fieldType === "select" || fieldData.fieldType === "multiselect" || fieldData.fieldType === "radio") && (
              <div>
                <Label>Options (one per line)</Label>
                <Textarea
                  value={Array.isArray(fieldData.fieldOptions) ? fieldData.fieldOptions.join('\n') : ''}
                  onChange={(e) => setFieldData({ 
                    ...fieldData, 
                    fieldOptions: e.target.value.split('\n').filter(opt => opt.trim()) 
                  })}
                  placeholder="Option 1&#10;Option 2&#10;Option 3"
                />
              </div>
            )}

            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={fieldData.isRequired}
                  onCheckedChange={(checked) => setFieldData({ ...fieldData, isRequired: checked })}
                />
                <Label>Required Field</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={fieldData.isVisible}
                  onCheckedChange={(checked) => setFieldData({ ...fieldData, isVisible: checked })}
                />
                <Label>Visible</Label>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button onClick={handleSubmit}>
                {field ? "Update Field" : "Add Field"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral">
        <Sidebar />
        <div className="pl-64">
          <Header title="Master Configuration" subtitle="Configure forms and fields across all sections" />
          <div className="p-6">
            <div className="text-center">Loading configuration...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral">
      <Sidebar />
      <div className="pl-64">
        <Header 
          title="Master Configuration Console"
          subtitle="Customize forms and fields across all cybercrime management sections"
        />
        
        <main className="p-6">
          <Tabs defaultValue="forms" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="forms">Form Configuration</TabsTrigger>
              <TabsTrigger value="workflows">Workflow Settings</TabsTrigger>
              <TabsTrigger value="templates">Document Templates</TabsTrigger>
            </TabsList>

            <TabsContent value="forms" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Form Type Selection</h2>
                  <p className="text-gray-600">Select a form to customize its fields and layout</p>
                </div>
                <Button onClick={() => setIsAddFieldDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Field
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Available Forms</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {formTypes.map((form) => {
                      const Icon = form.icon;
                      return (
                        <button
                          key={form.value}
                          onClick={() => setSelectedForm(form.value)}
                          className={`w-full flex items-center p-3 rounded-lg border text-left transition-colors ${
                            selectedForm === form.value 
                              ? "bg-primary text-primary-foreground" 
                              : "hover:bg-gray-50"
                          }`}
                        >
                          <Icon className="h-4 w-4 mr-3" />
                          <span className="text-sm">{form.label}</span>
                        </button>
                      );
                    })}
                  </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>
                      {formTypes.find(f => f.value === selectedForm)?.label} - Field Configuration
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {currentFormFields?.length > 0 ? (
                        currentFormFields.map((field: FormConfiguration) => (
                          <div key={field.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center space-x-3">
                              <Badge variant={field.isRequired ? "default" : "outline"}>
                                {field.isRequired ? "Required" : "Optional"}
                              </Badge>
                              <div>
                                <p className="font-medium">{field.fieldLabel}</p>
                                <p className="text-sm text-gray-600">
                                  {field.fieldName} • {field.fieldType}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setEditingField(field)}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => deleteFieldMutation.mutate(field.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          No fields configured for this form. Add fields to customize the form layout.
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Standard Cybercrime Form Fields</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { name: "fir_number", label: "FIR Number", type: "text", required: true },
                      { name: "incident_date", label: "Incident Date", type: "date", required: true },
                      { name: "crime_category", label: "Crime Category", type: "select", required: true },
                      { name: "complainant_name", label: "Complainant Name", type: "text", required: true },
                      { name: "complainant_phone", label: "Complainant Phone", type: "phone", required: true },
                      { name: "complainant_email", label: "Complainant Email", type: "email", required: false },
                      { name: "incident_description", label: "Incident Description", type: "textarea", required: true },
                      { name: "financial_loss", label: "Financial Loss Amount", type: "number", required: false },
                      { name: "evidence_files", label: "Evidence Files", type: "file", required: false },
                      { name: "suspect_details", label: "Suspect Details", type: "textarea", required: false },
                      { name: "investigation_officer", label: "Investigation Officer", type: "select", required: true },
                      { name: "case_priority", label: "Case Priority", type: "select", required: true },
                    ].map((field) => (
                      <div key={field.name} className="p-3 border rounded-lg bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">{field.label}</span>
                          <Badge variant={field.required ? "default" : "outline"} className="text-xs">
                            {field.required ? "Req" : "Opt"}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600">{field.name} • {field.type}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-2 text-xs"
                          onClick={() => addFieldMutation.mutate({
                            fieldName: field.name,
                            fieldLabel: field.label,
                            fieldType: field.type,
                            isRequired: field.required,
                            formType: selectedForm,
                          })}
                        >
                          Add to Form
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="workflows" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    Investigation Workflow Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { stage: "Registration", description: "Initial complaint registration and FIR creation", duration: "1-2 hours" },
                      { stage: "Preliminary Investigation", description: "Basic investigation and evidence collection", duration: "2-7 days" },
                      { stage: "Technical Analysis", description: "Digital forensics and technical examination", duration: "7-15 days" },
                      { stage: "Final Investigation", description: "Detailed investigation and report preparation", duration: "15-30 days" },
                      { stage: "Legal Action", description: "Chargesheet preparation and court proceedings", duration: "30+ days" },
                    ].map((stage, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-semibold">{stage.stage}</h3>
                          <p className="text-sm text-gray-600">{stage.description}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline">{stage.duration}</Badge>
                          <Button variant="outline" size="sm" className="ml-2">
                            Configure
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="templates" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Document Templates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { name: "FIR Template", description: "Standard FIR format for cybercrime cases" },
                      { name: "Investigation Report", description: "Comprehensive investigation report template" },
                      { name: "Technical Analysis Report", description: "Digital forensics analysis report" },
                      { name: "Chargesheet Template", description: "Legal chargesheet format" },
                      { name: "Evidence Collection Form", description: "Standard evidence documentation format" },
                      { name: "Victim Statement Form", description: "Victim interview and statement template" },
                    ].map((template, idx) => (
                      <div key={idx} className="p-4 border rounded-lg">
                        <h3 className="font-semibold">{template.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                        <div className="flex space-x-2 mt-3">
                          <Button variant="outline" size="sm">Edit Template</Button>
                          <Button variant="outline" size="sm">Preview</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <FieldFormDialog
            field={editingField}
            isOpen={!!editingField}
            onClose={() => setEditingField(null)}
          />

          <FieldFormDialog
            isOpen={isAddFieldDialogOpen}
            onClose={() => setIsAddFieldDialogOpen(false)}
          />
        </main>
      </div>
    </div>
  );
}