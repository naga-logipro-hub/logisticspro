
import { CFormLabel, CFormSelect } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import CustomerFreightApi from '../../Service/SubMaster/CustomerFreightApi'
//import FreightRateApi from '../../Service/SubMaster/FreightRateApi'
import Select from 'react-select'

const FreightCustomerListSearchSelect = (
  {
    size,
  id,
  code,
  className,
  onChange,
  label,
  noOptionsMessage,
  search_type,
  editFieldsReadOnly,
  isDisabled
  }
) => {
  const option = [{ value: '', label: 'Select' }]

  const [institution_customer_id, setCustomer] = useState([])

  useEffect(() => {
    //fetch to get Drivers list form master
    CustomerFreightApi.getCustomerFreight().then((res) => {
      setCustomer(res.data.data)
     // console.log(res.data.data)
    })
  }, [])

  if (search_type == 'institution_customer_id') {
    institution_customer_id.map(({ id, customer_name,customer_code }) => {
      option.push({ value: id, label: customer_name+' - '+customer_code})
    })
   // console.log(institution_customer_id)
  }

  return (
    <>
      <Select
        options={option}
        isDisabled={editFieldsReadOnly}
        //editFieldsReadOnly
        placeholder={label}
        noOptionsMessage={() => noOptionsMessage}
        size={size}
        className={className}
        onChange={(e) => onChange(e)}
      />
    </>
  )
}


export default FreightCustomerListSearchSelect


