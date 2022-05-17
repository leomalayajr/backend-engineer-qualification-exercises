/**
 * LOGEST function.
 * https://www.statisticshowto.com/probability-and-statistics/regression-analysis/find-a-linear-regression-equation
 * http://www.exceluser.com/formulas/how-to-calculate-both-types-of-compound-growth-rates.html
 * https://www.excelfunctions.net/excel-logest-function.html
 * @param data 
 */

import * as np from 'numjs';
import * as math from 'mathjs';

function expected_value(x:number[], p:number[]){
  let expectedValue = 0;
  for (let a=0; a<x.length; a++){
      expectedValue += x[a] * (p[a] / x.length);
  }
  return expectedValue;
}

function generate_ones(length:number){
  let result = [];
  for (let a=0; a<length; a++){
      result.push(1);
  }
  return result;
}

function covariance(x: number[], y: number[]){
  let xy = np.multiply(x,y);
  let ex = expected_value(x, generate_ones(x.length));
  let ey = expected_value(y, generate_ones(y.length));
  let exy = expected_value(xy.tolist(), generate_ones(xy.size));
  return exy - (ex * ey);
}

export default function logest(ys: number[]): number {
  let y = math.log(ys);
  let x = [];
  let res = 0;

  let hasNegative = ys.some(v => v < 0);
  if (hasNegative) return NaN;

  let hasZero = ys.some(v => v == 0);
  if (hasZero) return NaN;

  for (let a = 0; a<ys.length; a++){
    x.push(a);
  }
  
  let covMatrix = (np.array([[covariance(x, x), covariance(x, y)], [covariance(y, x), covariance(y, y)]])).tolist();
  res = math.exp(covMatrix[0][1] / covMatrix[0][0]);

  return(res);
}
