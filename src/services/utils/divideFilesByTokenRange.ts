import { FilenameWithPatch } from '../types';

const divideFilesByTokenRange = (
  tokensRange: number,
  files: FilenameWithPatch[],
) => {
  const result: FilenameWithPatch[][] = [];

  let currentArray: FilenameWithPatch[] = [];
  let currentTokensUsed = 0;

  for (const file of files) {
    if (currentTokensUsed + file.tokensUsed <= tokensRange) {
      currentArray.push(file);
      currentTokensUsed += file.tokensUsed;
    } else {
      result.push(currentArray);
      currentArray = [file];
      currentTokensUsed = file.tokensUsed;
    }
  }

  if (currentArray.length > 0) {
    result.push(currentArray);
  }

  return result;
};

export default divideFilesByTokenRange;
