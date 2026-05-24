/** Set to false when wiring real file APIs */
export const USE_STATIC_FILES_UI = true;

export interface MockProject {
  _id: string;
  name: string;
}

export interface MockFileListItem {
  _id: string;
  filename: string;
  sourceType: "file";
  fileMetaDataCount: number;
  createdTime: number;
  updatedTime: number;
}

export interface MockFileDetail {
  _id: string;
  filename: string;
  uri: string;
  resource_id: string;
  mime_type: string;
  status: string;
  status_detail: string | null;
  description: string | null;
  ai_summary: string;
  created_at: string;
  updated_at: string;
  publicUrl: string;
  extracted_text_pages: string[];
}

export const MOCK_PROJECTS: MockProject[] = [
  { _id: "proj-ee-pdf", name: "EE_PDF_Catalog" },
  { _id: "proj-magento", name: "Magento Data" },
  { _id: "proj-support", name: "Customer Support" },
];

const AI_SUMMARY =
  "The document is a detailed catalog focusing on marine safety equipment, including life jackets, fire suppression systems, and detection tools. It highlights specific product models such as the Plastimo Offshore 150N and Exalto Emirates safety gear, providing technical specifications and brand references for maritime compliance.";

const EXTRACTED_PAGES = [
  `Life Jackets 1380-1386
Safety Equipment 1387-1391
Fire Suppression 1392-1394
Fire Detection 1395`,
  `Inflatable Life Jackets 1396-1402
Deck Safety Lines 1403-1408
Emergency Signaling 1409-1412`,
  `Maintenance & Inspection 1413-1418
Compliance Notes 1419-1422`,
];

export const MOCK_FILE_DETAILS: Record<string, MockFileDetail> = {
  "file-safety-pdf": {
    _id: "file-safety-pdf",
    filename: "16-Safety.pdf",
    uri: "file:///data/EE_PDF_Catalog/16-Safety.pdf",
    resource_id: "res-8f3c2a91-4d7e-4b12-9c6a-1e2f4a8b0c3d",
    mime_type: "application/pdf",
    status: "ready",
    status_detail: null,
    description: null,
    ai_summary: AI_SUMMARY,
    created_at: "2024-04-03T12:46:35.172815",
    updated_at: "2024-04-03T12:58:51.996562",
    publicUrl: "#",
    extracted_text_pages: EXTRACTED_PAGES,
  },
  "file-catalog-pdf": {
    _id: "file-catalog-pdf",
    filename: "Product-Catalog-2024.pdf",
    uri: "file:///data/EE_PDF_Catalog/Product-Catalog-2024.pdf",
    resource_id: "res-2b9e7f14-6a3c-4d89-b1f0-7c4e9a2d5f61",
    mime_type: "application/pdf",
    status: "ready",
    status_detail: null,
    description: "Main product catalog for Q1 2024.",
    ai_summary: AI_SUMMARY,
    created_at: "2024-03-18T09:12:10.000000",
    updated_at: "2024-03-20T14:22:44.000000",
    publicUrl: "#",
    extracted_text_pages: EXTRACTED_PAGES.slice(0, 2),
  },
  "file-manual-pdf": {
    _id: "file-manual-pdf",
    filename: "Installation-Manual.pdf",
    uri: "file:///data/Magento Data/Installation-Manual.pdf",
    resource_id: "res-5d1a8c72-9e4f-4a6b-8d2c-3f7b1e0a9c84",
    mime_type: "application/pdf",
    status: "processing",
    status_detail: "Extracting text from page 3 of 12",
    description: null,
    ai_summary: "Installation manual covering setup, wiring, and troubleshooting for marine navigation hardware.",
    created_at: "2024-05-01T08:30:00.000000",
    updated_at: "2024-05-01T08:45:12.000000",
    publicUrl: "#",
    extracted_text_pages: [EXTRACTED_PAGES[0]],
  },
};

export const MOCK_FILES_LIST: MockFileListItem[] = [
  {
    _id: "file-safety-pdf",
    filename: "16-Safety.pdf",
    sourceType: "file",
    fileMetaDataCount: 4,
    createdTime: new Date("2024-04-03T12:46:35").getTime(),
    updatedTime: new Date("2024-04-03T12:58:51").getTime(),
  },
  {
    _id: "file-catalog-pdf",
    filename: "Product-Catalog-2024.pdf",
    sourceType: "file",
    fileMetaDataCount: 12,
    createdTime: new Date("2024-03-18T09:12:10").getTime(),
    updatedTime: new Date("2024-03-20T14:22:44").getTime(),
  },
  {
    _id: "file-manual-pdf",
    filename: "Installation-Manual.pdf",
    sourceType: "file",
    fileMetaDataCount: 0,
    createdTime: new Date("2024-05-01T08:30:00").getTime(),
    updatedTime: new Date("2024-05-01T08:45:12").getTime(),
  },
];

export function getMockFileDetail(fileId: string): MockFileDetail {
  return (
    MOCK_FILE_DETAILS[fileId] ?? {
      ...MOCK_FILE_DETAILS["file-safety-pdf"],
      _id: fileId,
      filename: `File-${fileId.slice(0, 8)}.pdf`,
      resource_id: fileId,
    }
  );
}
