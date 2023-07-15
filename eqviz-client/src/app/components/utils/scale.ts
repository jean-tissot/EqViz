export default class Scale {

  static melScaleRanges = [20, 160, 394, 670, 1000, 1420, 1900, 2450, 3120, 4000, 5100, 6600, 9000, 14000];

  static toMelScale(dataFreq: Uint8Array, Fe = 44100): number[] {
    const melScaledData = [];

    const frqCount = dataFreq.length; // TODO: should we use the nfft instead ?
    const step = Fe / frqCount;

    const currentFreqIndex = 0;
    for (let melRangeEnd of this.melScaleRanges) {
      let sumOfValuesToAppend = 0;
      let nbValueInRangeToAppend = 0;
      for (let i = currentFreqIndex; step * i < melRangeEnd && i < dataFreq.length; i++) {
        sumOfValuesToAppend += dataFreq[i];
        nbValueInRangeToAppend++;
      }
      // When there is not anymore freqs to process, we break the for loop
      if (nbValueInRangeToAppend == 0) break;
      melScaledData.push(sumOfValuesToAppend / nbValueInRangeToAppend);
    }

    return melScaledData;
  }

  static toLogScale(data: Uint8Array, factor: number) {
    const result = [];
    let sumOfValuesToAppend = 0;
    let nbValueInRangeToAppend = 0;
    for (let i = 0; i < data.length; i++) {
      sumOfValuesToAppend += data[i];
      nbValueInRangeToAppend++;
      if (i >= Math.pow(factor, result.length)) {
        result.push(sumOfValuesToAppend / nbValueInRangeToAppend);
        sumOfValuesToAppend = 0;
        nbValueInRangeToAppend = 0;
      }
    }
    return result;
  }
}