import { Item } from '../shared';

export const getFilteredSuggestions = (
  items: any[],
  inputValue: string,
  activeItem?: Item,
) => {
  const isArrayFilter = (item) => {
    return (
      activeItem?.type !== 'field' ||
      (activeItem?.type === 'field' && !activeItem?.isArray) ||
      (activeItem?.type === 'field' &&
        activeItem?.isArray &&
        item.supportIsArray)
    );
  };

  const filterFunc = (item) =>
    (item?.text?.toLowerCase().includes(inputValue.toLowerCase()) ||
      item?.value?.toLowerCase().includes(inputValue.toLowerCase())) &&
    (activeItem?.type !== 'field' ||
      (activeItem?.type === 'field' &&
        'types' in item &&
        item?.types.includes(activeItem?.fieldType)));

  // Group case
  if (items[0]?.title) {
    return items
      .map((group) => {
        return {
          ...group,
          items: group.items.filter(isArrayFilter).filter(filterFunc),
        };
      })
      .filter(({ items }) => items.length > 0);
  }

  return items.filter(isArrayFilter).filter(filterFunc);
};

export const flattenSuggestions = (items: any[]) => {
  if (items[0]?.items) {
    return items.reduce((a, c) => {
      return [...a, ...c.items];
    }, []);
  }

  return items;
};
