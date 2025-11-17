// import { useSelector } from "react-redux";
// import type { RootState } from "../app/store";

/**
 * usePermission hook (using allTasks only)
 * 
 * This exposes the system-defined task list and allows
 * checking whether a given action/task exists in the system.
 */
// export function usePermission() {
// //   const userInfo = useSelector((state: RootState) => state.auth.userInfo);
//   const allTasks = localStorage.getItem("taskName") || [];

//   const allTaskNames = allTasks.map((t) => t.taskName);

//   /**
//    * Checks whether a given task is part of the system's available tasks.
//    */
//   const hasPermission = (taskName: string): boolean => {
//     return allTaskNames.includes(taskName);
//   };

//   return {
//     allTasks,
//     hasPermission,
//   };
// }
export function usePermission() {
  // Fix: Parse JSON from localStorage (it returns string)
  const storedTasks = localStorage.getItem("tasks");
  const allTasks: any[] = storedTasks ? JSON.parse(storedTasks) : [];

  // Extract task names
  const allTaskNames = allTasks.map((t: any) => t.taskName);

  /**
   * Checks whether a given task is part of the system's available tasks.
   */
  const hasPermission = (taskName: string): boolean => {
    return allTaskNames.includes(taskName);
  };

  return {
    allTasks,
    hasPermission,
  };
}