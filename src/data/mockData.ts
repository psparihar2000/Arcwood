export interface DocumentField {
  id: string;
  name: string;
  label: string;
  value: string;
  originalValue?: string;
  confidence: "high" | "medium" | "low";
  confidenceScore: number;
  required: boolean;
  edited: boolean;
  approved: boolean;
  evidence: {
    pageNumber: number;
    boundingBox: { x: number; y: number; width: number; height: number };
    extractedText: string;
  }[];
  historicalRecommendations?: string[];
  fieldType: "text" | "number" | "date" | "select" | "currency";
  options?: string[];
}

export interface Document {
  id: string;
  name: string;
  uploadDate: string;
  status: "uploading" | "processing" | "ready" | "in_review" | "validated" | "submitted" | "failed";
  type: string;
  pageCount: number;
  size: string;
  customer: string;
  uploadedBy: string;
  processingProgress?: number;
  validationStatus?: {
    total: number;
    validated: number;
    missing: number;
    lowConfidence: number;
  };
}

export interface HistoryEntry {
  id: string;
  documentName: string;
  customer: string;
  submittedBy: string;
  submittedAt: string;
  status: "success" | "failed" | "pending";
  fieldsExtracted: number;
  mmsReference?: string;
  errorMessage?: string;
}

export const mockDocuments: Document[] = [
  {
    id: "doc-001",
    name: "delivery_note_2024_Q1.pdf",
    uploadDate: "2024-03-24T08:30:00",
    status: "ready",
    type: "Delivery Note",
    pageCount: 1,
    size: "890 KB",
    customer: "Acme Manufacturing Inc.",
    uploadedBy: "Sarah Johnson",
    validationStatus: {
      total: 18,
      validated: 14,
      missing: 3,
      lowConfidence: 1,
    },
  },
  {
    id: "doc-002",
    name: "Invoice_ACC_78934.pdf",
    uploadDate: "2024-03-24T09:15:00",
    status: "in_review",
    type: "Invoice",
    pageCount: 2,
    size: "1.8 MB",
    customer: "TechCorp Solutions",
    uploadedBy: "Michael Chen",
    validationStatus: {
      total: 19,
      validated: 19,
      missing: 0,
      lowConfidence: 0,
    },
  },
  {
    id: "doc-003",
    name: "PO-2024-MAR-0145.pdf",
    uploadDate: "2024-03-24T10:00:00",
    status: "processing",
    type: "Purchase Order",
    pageCount: 3,
    size: "2.4 MB",
    customer: "Global Logistics Ltd",
    uploadedBy: "Emily Rodriguez",
    processingProgress: 67,
  },
  {
    id: "doc-004",
    name: "Contract_Amendment_v3.pdf",
    uploadDate: "2024-03-23T16:45:00",
    status: "submitted",
    type: "Contract",
    pageCount: 8,
    size: "4.2 MB",
    customer: "Enterprise Systems Corp",
    uploadedBy: "David Park",
  },
  {
    id: "doc-005",
    name: "Quote_REQ_9876.pdf",
    uploadDate: "2024-03-23T14:20:00",
    status: "failed",
    type: "Quote",
    pageCount: 2,
    size: "1.2 MB",
    customer: "BuildRight Construction",
    uploadedBy: "Sarah Johnson",
  },
];

export const mockFields: DocumentField[] = [
  {
    id: "field-001",
    name: "document_number",
    label: "Delivery Note Number",
    value: "DN-2024-Q1-045",
    confidence: "high",
    confidenceScore: 98,
    required: true,
    edited: false,
    approved: false,
    fieldType: "text",
    evidence: [
      {
        pageNumber: 1,
        boundingBox: { x: 450, y: 32, width: 130, height: 22 },
        extractedText: "DN-2024-Q1-045",
      },
    ],
  },
  {
    id: "field-002",
    name: "document_date",
    label: "Document Date",
    value: "2024-03-20",
    confidence: "high",
    confidenceScore: 96,
    required: true,
    edited: false,
    approved: false,
    fieldType: "date",
    evidence: [
      {
        pageNumber: 1,
        boundingBox: { x: 450, y: 56, width: 130, height: 20 },
        extractedText: "March 20, 2024",
      },
    ],
  },
  {
    id: "field-003",
    name: "sender_company",
    label: "Sender Company",
    value: "Global Logistics Ltd",
    confidence: "high",
    confidenceScore: 95,
    required: true,
    edited: false,
    approved: false,
    fieldType: "text",
    evidence: [
      {
        pageNumber: 1,
        boundingBox: { x: 32, y: 60, width: 180, height: 20 },
        extractedText: "Global Logistics Ltd",
      },
    ],
  },
  {
    id: "field-004",
    name: "sender_address_line1",
    label: "Sender Address Line 1",
    value: "456 Commerce Street, Suite 200",
    confidence: "high",
    confidenceScore: 92,
    required: false,
    edited: false,
    approved: false,
    fieldType: "text",
    evidence: [
      {
        pageNumber: 1,
        boundingBox: { x: 32, y: 82, width: 270, height: 20 },
        extractedText: "456 Commerce Street, Suite 200",
      },
    ],
  },
  {
    id: "field-005",
    name: "sender_city_state_zip",
    label: "Sender City, State, ZIP",
    value: "Chicago, IL 60601",
    confidence: "high",
    confidenceScore: 94,
    required: false,
    edited: false,
    approved: false,
    fieldType: "text",
    evidence: [
      {
        pageNumber: 1,
        boundingBox: { x: 32, y: 104, width: 160, height: 20 },
        extractedText: "Chicago, IL 60601",
      },
    ],
  },
  {
    id: "field-006",
    name: "recipient_name",
    label: "Ship To Name",
    value: "Acme Manufacturing Inc.",
    confidence: "high",
    confidenceScore: 97,
    required: true,
    edited: false,
    approved: false,
    fieldType: "text",
    evidence: [
      {
        pageNumber: 1,
        boundingBox: { x: 32, y: 164, width: 220, height: 20 },
        extractedText: "Acme Manufacturing Inc.",
      },
    ],
  },
  {
    id: "field-007",
    name: "recipient_address_line1",
    label: "Ship To Address Line 1",
    value: "1234 Industrial Parkway, Suite 500",
    confidence: "high",
    confidenceScore: 90,
    required: true,
    edited: false,
    approved: false,
    fieldType: "text",
    evidence: [
      {
        pageNumber: 1,
        boundingBox: { x: 32, y: 186, width: 310, height: 20 },
        extractedText: "1234 Industrial Parkway, Suite 500",
      },
    ],
  },
  {
    id: "field-008",
    name: "recipient_city_state_zip",
    label: "Ship To City, State, ZIP",
    value: "Houston, TX 77001",
    confidence: "high",
    confidenceScore: 93,
    required: true,
    edited: false,
    approved: false,
    fieldType: "text",
    evidence: [
      {
        pageNumber: 1,
        boundingBox: { x: 32, y: 208, width: 170, height: 20 },
        extractedText: "Houston, TX 77001",
      },
    ],
  },
  {
    id: "field-009",
    name: "item_1_sku",
    label: "Item 1 - SKU",
    value: "SKU-001",
    confidence: "high",
    confidenceScore: 99,
    required: true,
    edited: false,
    approved: false,
    fieldType: "text",
    evidence: [
      {
        pageNumber: 1,
        boundingBox: { x: 40, y: 302, width: 70, height: 28 },
        extractedText: "SKU-001",
      },
    ],
  },
  {
    id: "field-010",
    name: "item_1_description",
    label: "Item 1 - Description",
    value: "Industrial Bearings",
    confidence: "high",
    confidenceScore: 96,
    required: true,
    edited: false,
    approved: false,
    fieldType: "text",
    evidence: [
      {
        pageNumber: 1,
        boundingBox: { x: 215, y: 302, width: 165, height: 28 },
        extractedText: "Industrial Bearings",
      },
    ],
  },
  {
    id: "field-011",
    name: "item_1_quantity",
    label: "Item 1 - Quantity",
    value: "250",
    confidence: "high",
    confidenceScore: 98,
    required: true,
    edited: false,
    approved: false,
    fieldType: "number",
    evidence: [
      {
        pageNumber: 1,
        boundingBox: { x: 548, y: 302, width: 32, height: 28 },
        extractedText: "250",
      },
    ],
  },
  {
    id: "field-012",
    name: "item_2_sku",
    label: "Item 2 - SKU",
    value: "SKU-002",
    confidence: "high",
    confidenceScore: 99,
    required: true,
    edited: false,
    approved: false,
    fieldType: "text",
    evidence: [
      {
        pageNumber: 1,
        boundingBox: { x: 40, y: 332, width: 70, height: 28 },
        extractedText: "SKU-002",
      },
    ],
  },
  {
    id: "field-013",
    name: "item_2_description",
    label: "Item 2 - Description",
    value: "Mounting Hardware",
    confidence: "high",
    confidenceScore: 94,
    required: true,
    edited: false,
    approved: false,
    fieldType: "text",
    evidence: [
      {
        pageNumber: 1,
        boundingBox: { x: 215, y: 332, width: 165, height: 28 },
        extractedText: "Mounting Hardware",
      },
    ],
  },
  {
    id: "field-014",
    name: "item_2_quantity",
    label: "Item 2 - Quantity",
    value: "500",
    confidence: "high",
    confidenceScore: 97,
    required: true,
    edited: false,
    approved: false,
    fieldType: "number",
    evidence: [
      {
        pageNumber: 1,
        boundingBox: { x: 548, y: 332, width: 32, height: 28 },
        extractedText: "500",
      },
    ],
  },
  {
    id: "field-015",
    name: "total_items",
    label: "Total Line Items",
    value: "2",
    confidence: "high",
    confidenceScore: 100,
    required: false,
    edited: false,
    approved: false,
    fieldType: "number",
    evidence: [
      {
        pageNumber: 1,
        boundingBox: { x: 32, y: 250, width: 548, height: 120 },
        extractedText: "[Table with 2 items detected]",
      },
    ],
  },
  {
    id: "field-016",
    name: "carrier_name",
    label: "Carrier Name",
    value: "",
    confidence: "low",
    confidenceScore: 0,
    required: false,
    edited: false,
    approved: false,
    fieldType: "text",
    evidence: [],
    historicalRecommendations: ["FedEx Ground", "UPS Standard", "Local Delivery"],
  },
  {
    id: "field-017",
    name: "tracking_number",
    label: "Tracking Number",
    value: "",
    confidence: "low",
    confidenceScore: 0,
    required: false,
    edited: false,
    approved: false,
    fieldType: "text",
    evidence: [],
    historicalRecommendations: ["1Z999AA10123456784", "794612345678", "9405511899223456789123"],
  },
  {
    id: "field-018",
    name: "delivery_instructions",
    label: "Delivery Instructions",
    value: "",
    confidence: "low",
    confidenceScore: 0,
    required: false,
    edited: false,
    approved: false,
    fieldType: "text",
    evidence: [],
    historicalRecommendations: ["Leave at loading dock", "Signature required", "Call on arrival"],
  },
];

export const mockHistory: HistoryEntry[] = [
  {
    id: "hist-001",
    documentName: "PO-2024-MAR-0132.pdf",
    customer: "Acme Manufacturing Inc.",
    submittedBy: "Sarah Johnson",
    submittedAt: "2024-03-24T07:15:00",
    status: "success",
    fieldsExtracted: 24,
    mmsReference: "MMS-20240324-0001",
  },
  {
    id: "hist-002",
    documentName: "Invoice_ACC_78901.pdf",
    customer: "TechCorp Solutions",
    submittedBy: "Michael Chen",
    submittedAt: "2024-03-23T18:42:00",
    status: "success",
    fieldsExtracted: 19,
    mmsReference: "MMS-20240323-0047",
  },
  {
    id: "hist-003",
    documentName: "Quote_REQ_9876.pdf",
    customer: "BuildRight Construction",
    submittedBy: "Sarah Johnson",
    submittedAt: "2024-03-23T16:20:00",
    status: "failed",
    fieldsExtracted: 15,
    errorMessage: "MMS connection timeout - data preserved for retry",
  },
  {
    id: "hist-004",
    documentName: "Contract_v2.pdf",
    customer: "Enterprise Systems Corp",
    submittedBy: "David Park",
    submittedAt: "2024-03-23T14:55:00",
    status: "success",
    fieldsExtracted: 31,
    mmsReference: "MMS-20240323-0038",
  },
  {
    id: "hist-005",
    documentName: "delivery_note_Q1_045.pdf",
    customer: "Global Logistics Ltd",
    submittedAt: "2024-03-23T11:30:00",
    submittedBy: "Emily Rodriguez",
    status: "pending",
    fieldsExtracted: 12,
  },
];

export const userRoles = {
  sme: "Subject Matter Expert",
  admin: "Administrator",
  viewer: "Viewer",
};

export const currentUser = {
  name: "Sarah Johnson",
  email: "sarah.johnson@arcwood.com",
  role: "sme" as keyof typeof userRoles,
  avatar: "SJ",
};
