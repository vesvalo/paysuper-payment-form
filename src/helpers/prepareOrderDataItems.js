import { ceil, lastIndexOf, min } from 'lodash-es';

function getResizedImageUrl(url, width = 'AUTO', height = 'AUTO') {
  const lastSlashIndex = lastIndexOf(url, '/');
  const firstUrlPart = url.substr(0, lastSlashIndex);
  const lastUrlPart = url.substr(lastSlashIndex);
  return `${firstUrlPart}/rsz/${ceil(width)}x${ceil(height)}${lastUrlPart}`;
}
export default function prepareOrderDataItems(items, layout) {
  if (!items || !items.length) {
    return items;
  }
  const itemsLength = min([items.length, 7]);
  const newItems = [...items];
  const ratioByLayout = layout === 'page' ? 1.5 : 1;
  let sizes = [];

  switch (itemsLength) {
    case 1:
      sizes = [[280, 187.6]];
      break;
    case 2:
      sizes = [
        [135, 135],
        [135, 135],
      ];
      break;
    case 3:
      sizes = [
        [86.66, 86.66],
        [86.66, 86.66],
        [86.66, 86.66],
      ];
      break;
    case 4:
      sizes = [
        [62.5, 62.5],
        [62.5, 62.5],
        [62.5, 62.5],
        [62.5, 62.5],
      ];
      break;
    case 5:
      sizes = [
        [135, 135],
        [135, 135],
        [86.66, 86.66],
        [86.66, 86.66],
        [86.66, 86.66],
      ];
      break;
    case 6:
      sizes = [
        [86.66, 86.66],
        [86.66, 86.66],
        [86.66, 86.66],
        [86.66, 86.66],
        [86.66, 86.66],
        [86.66, 86.66],
      ];
      break;
    default:
      sizes = [
        [86.66, 86.66],
        [86.66, 86.66],
        [86.66, 86.66],
        [62.5, 62.5],
        [62.5, 62.5],
        [62.5, 62.5],
        [62.5, 62.5],
      ];
  }

  for (let i = 0; i < itemsLength; i += 1) {
    newItems[i] = {
      ...newItems[i],
      images: [
        getResizedImageUrl(
          newItems[i].images[0],
          sizes[i][0] * ratioByLayout,
          sizes[i][1] * ratioByLayout,
        ),
      ],
    };
  }

  return newItems;
}
