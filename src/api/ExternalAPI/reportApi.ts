import externalApi from "./externalAxios";

interface GetMsListParams {
  typeCode: number;
  classCode?: string;
}

export const ReportApi = {
  // Get master list based on typeCode and optional classCode
  getMsList: ({ typeCode, classCode }: GetMsListParams) => {
    return externalApi.get("/Generic/GetMsList", {
      params: {
        TypeCode: typeCode,
        ...(classCode && { ClassCode: classCode }),
      },
    });
  },

  // Get report types for a given reportCode
  getMsReportTypes: (reportCode: string) => {
    return externalApi.get("/Generic/MsReportTypes", {
      params: { ReportCode: reportCode },
    });
  },

  // Get list of departments
  getDepartments: () => {
    return externalApi.get("/Generic/GetDeps");
  },

  // Get branch regions
  getBranchRegions: () => {
    return externalApi.get("/Generic/BranchRegions"); // changed to GET for consistency
  },

  // Get branch list
  getBranch: () => {
    return externalApi.get("/Generic/GetBranch"); // changed to GET
  },

  // Get provinces
  getProvince: () => {
    return externalApi.get("/Generic/GetProvince"); // changed to GET
  },

  // Get fiscal years
  getFiscalYears: () => {
    return externalApi.get("/Generic/GetFiscalYear"); // changed to GET
  },
};
