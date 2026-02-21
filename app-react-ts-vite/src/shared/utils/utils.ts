export function formatDate(dateString: string) {
  const date = new Date(dateString);

  const dateFormatOptions: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  };
  const timeFormatOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  };

  const dateFormatter = new Intl.DateTimeFormat('en-US', dateFormatOptions);
  const timeFormatter = new Intl.DateTimeFormat('en-US', timeFormatOptions);

  const formattedDate = `${dateFormatter.format(
    date
  )}, ${date.getFullYear()} ${timeFormatter.format(date)}`;

  return formattedDate;
}

export const degToRad = (degrees: number) => degrees * (Math.PI / 180);

export function mapRange(
  inputMin: number,
  inputMax: number,
  outputMin: number,
  outputMax: number
): (v: number) => number {
  return (value: number) => {
    const normalizedValue = (value - inputMin) / (inputMax - inputMin);
    const outputValue = normalizedValue * (outputMax - outputMin) + outputMin;
    return outputValue;
  };
}
