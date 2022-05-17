/**
 * Calculates the ratio between the amount of time when status is AVAILABLE and
 * the amount of time between startDateTime inclusive and endDateTime exclusive.
 * @param startDateTime 
 * @param endDateTime 
 */

 import dataJson from './data.json';
export function availability(startDateTime: Date, endDateTime: Date): number {
  // do something
  interface data_obj {
    timestamp: string,
    status: string,
  }

  let data: data_obj[];
  let data_err_count = 0;

  data = dataJson.filter(obj => {
    let obj_date = new Date(obj.timestamp);
    return obj_date >= startDateTime &&
      obj_date < endDateTime;
  });

  data.forEach(obj => {
    if (obj.status != "AVAILABLE"){
      data_err_count += 1;
    }
  });

  let res = (data_err_count / data.length) -1;
  return Math.abs(res);
}

/**
 * Generates the outages between startDateTime inclusive and endDateTime exclusive.
 * An outage is PARTIAL if the status within the period is PARTIALLY_AVAILABLE.
 * Similarly, an outage is MAJOR if the status within the period is MAJOR.
 * @param startDateTime 
 * @param endDateTime 
 */
export function outages(startDateTime: Date, endDateTime: Date): { type: 'PARTIAL' | 'MAJOR', timestamp: Date, duration: number }[] {
  // do something
  interface data_obj {
    timestamp: string,
    status: string,
  }
  
  interface outage {
    type: string,
    timestamp: Date,
    duration: number,
  }

  const outages: outage[] = [];
  let outage_counter = 0;
  let outage_base_date = '';
  let outage_type:  "MAJOR" | "PARTIAL" | "" = "";
  let data: data_obj[];
  let previous_status = '';

  data = dataJson.filter(obj => {
    let obj_date = new Date(obj.timestamp);
    return obj_date >= startDateTime &&
      obj_date < endDateTime;
  });

  for (let [idx, obj] of data.entries()) {
    if (previous_status == '') {
      previous_status = obj.status;
    }
    if (obj.status != 'AVAILABLE'){
      // init data for recording
      if (outage_counter == 0) {
        outage_counter = 1;
        outage_base_date = obj.timestamp;
        if (obj.status == 'PARTIALLY_AVAILABLE'){
          outage_type = 'PARTIAL';
        }
        else if (obj.status == 'UNAVAILABLE'){
          outage_type = 'MAJOR';
        }
      }
      // check if in the middle of counting something
      if (previous_status == obj.status){
        // continue adding outage record
        outage_counter += 1;
      }
      // check next data if counting should stop
      if (data.length -1 == idx || data[idx+1].status != obj.status){
        // reset and save
        outages.push({
          type: outage_type,
          timestamp: new Date(outage_base_date),
          duration: outage_counter,
        });
        outage_counter = 0;
        outage_base_date = '';
        outage_type = '';
      }
    }
    previous_status = obj.status;
  }

  return outages;
}