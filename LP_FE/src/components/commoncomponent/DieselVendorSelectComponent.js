import { CFormLabel, CFormSelect } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import DieselIntentCreationService from 'src/Service/DieselIntent/DieselIntentCreationService'
import ParkingYardGateService from 'src/Service/ParkingYardGate/ParkingYardGateService'

const DieseVendorSelectComponent = () => {
  const [driver, setDriver] = useState([])

  useEffect(() => {
    //fetch to get Drivers list form master
    DieselIntentCreationService.getDieselVendor().then((res) => {
      setDriver(res.data.data)
    })
  }, [])

  return (
    <>
        <option  value={''}>Select...</option>
        {driver.map(({ diesel_vendor_id, diesel_vendor_name }) => {
          return (
            <>
              <option key={diesel_vendor_id} value={diesel_vendor_id}>
                {diesel_vendor_name}
              </option>
            </>
          )
        })}

    </>
  )
}

export default DieseVendorSelectComponent
