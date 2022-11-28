import { UseFormRegisterReturn } from "react-hook-form";

export const refToInnerRef = ({ ref, ...rest }: UseFormRegisterReturn) => {
  return { ...rest, innerRef: ref };
};