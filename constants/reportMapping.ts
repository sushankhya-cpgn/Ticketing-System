export interface OptionType{
    label:string;
    value: string | number;
}


export const BRANCH_TYPES: OptionType[] = [
  { label: "Branch", value: "BRANCH" },
  { label: "Province", value: "PROVINCE" },
  { label: "Region", value: "REGION" },
];

export const REPORT_FILTERS: Record<
  string,
  { name: string; label: string; type: "select" | "text" }[]
> = {
  1: [
    { name: "department", label: "Department", type: "select" },
    { name: "agent", label: "Agent", type: "select" },
    { name: "clientCode", label: "Client Code", type: "text" },
  ],
  "CLAIM_REGISTER": [{ name: "riskCode", label: "Risk Code", type: "select" }],
};