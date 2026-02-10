
import { CFormLabel, CFormSelect } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import CustomerFreightApi from '../../Service/SubMaster/CustomerFreightApi'
import LocationApi from 'src/Service/SubMaster/LocationApi'
import Select from 'react-select'

const LocationSearchSelect = (
  {
    size,
  id,
  code,
  className,
  onChange,
  label,
  noOptionsMessage,
  search_type,
  isDisabled,
  }
) => {
  const option = [{ value: '', label: 'Select' }]


  const [location, getLocation] = useState([])

  useEffect(() => {
    //fetch to get Drivers list form master
    LocationApi.getLocation().then((res) => {
      getLocation(res.data.data)
      //console.log(res.data.data)
    })
  }, [])

  if (search_type == 'location_id') {
    location.map(({ id, location,location_code }) => {
      option.push({ value: id, label: location+' - '+location_code})
    })
    //console.log(location)
  }
  if (search_type == 'from_location') {
    location.map(({ id, location,location_code }) => {
      option.push({ value: id, label: location+' - '+location_code})
    })
    //console.log(location)
  }
  if (search_type == 'to_location') {
    location.map(({ id, location,location_code }) => {
      option.push({ value: id, label: location+' - '+location_code})
    })
    //console.log(location)
  }
  


  return (
    <>
      <Select
        options={option}
        placeholder={label}
        noOptionsMessage={() => noOptionsMessage}
        size={size}
        //isDisabled={editFieldsReadOnly}
        className={className}
        onChange={(e) => onChange(e)}
      />
    </>
  )
}


export default LocationSearchSelect
