import { defineCellRenderer } from './_utils';

export const CellRenderer = defineCellRenderer(props => {
  return <span>{props.value ?? ''}</span>;
});

export function cellValidator() {
  return true;
} 