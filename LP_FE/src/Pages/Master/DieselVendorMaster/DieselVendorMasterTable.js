import {
  CButton,
  CCard,
  CContainer,
  CCol,
  CRow,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CCardImage,
  CModalFooter,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import CustomTable from 'src/components/customComponent/CustomTable'
import DieselVendorMasterService from 'src/Service/Master/DieselVendorMasterService'

const DieselVendorMasterTable = () => {
  const [rowData, setRowData] = useState([])
  const [mount, setMount] = useState(1)
  const [pending, setPending] = useState(true)

  let viewData

  function changeDieselVendorStatus(id) {
    DieselVendorMasterService.deleteDieselVendors(id).then((res) => {
      toast.success('Diesel Vendor Status Updated Successfully!')
      setMount((preState) => preState + 1)
    })
  }

  useEffect(() => {
    DieselVendorMasterService.getDieselVendors().then((response) => {
      viewData = response.data.data
      let rowDataList = []
      viewData.map((data, index) => {
        console.log(data)
        rowDataList.push({
          sno: index + 1,
          Creation_Date: data.created_at,
          diesel_Vendor_Name: data.diesel_vendor_name,
          diesel_Vendor_Code: data.vendor_code,
          diesel_Vendor_Mobile1: data.vendor_phone_1,
          diesel_Vendor_Mobile2: data.vendor_phone_2,
          diesel_Vendor_Mail: data.vendor_email,
          Status: data.diesel_vendor_status === 1 ? '✔️' : '❌',

          Action: (
            <div className="d-flex justify-content-space-between">
              <CButton
                size="sm"
                color="danger"
                shape="rounded"
                id={data.id}
                onClick={() => {
                  changeDieselVendorStatus(data.diesel_vendor_id)
                }}
                className="m-1"
              >
                {/* Delete */}
                <i className="fa fa-trash" aria-hidden="true"></i>
              </CButton>
              <Link
                to={
                  data.diesel_vendor_status === 1
                    ? `DieselVendorMaster/${data.diesel_vendor_id}`
                    : ''
                }
              >
                <CButton
                  size="sm"
                  color="secondary"
                  shape="rounded"
                  disabled={data.diesel_vendor_status === 1 ? false : true}
                  id={data.id}
                  className="m-1"
                >
                  {/* Edit */}
                  <i className="fa fa-edit" aria-hidden="true"></i>
                </CButton>
              </Link>
            </div>
          ),
        })
      })
      setRowData(rowDataList)
      setPending(false)
    })
  }, [mount])

  const columns = [
    {
      name: 'S.No',
      selector: (row) => row.sno,
      sortable: true,
      center: true,
    },
    {
      name: 'Creation Date',
      selector: (row) => row.Creation_Date,
      sortable: true,
      center: true,
    },
    {
      name: 'Diesel Vendor Name',
      selector: (row) => row.diesel_Vendor_Name,
      sortable: true,
      center: true,
    },
    {
      name: 'Diesel Vendor Code',
      selector: (row) => row.diesel_Vendor_Code,
      sortable: true,
      center: true,
    },
    {
      name: 'Diesel Vendor Mobile Number 1',
      selector: (row) => row.diesel_Vendor_Mobile1,
      sortable: true,
      center: true,
    },
    {
      name: 'Diesel Vendor Mobile Number 2',
      selector: (row) => row.diesel_Vendor_Mobile2,
      sortable: true,
      center: true,
    },
    {
      name: 'Diesel Vendor Mail ID',
      selector: (row) => row.diesel_Vendor_Mail,
      sortable: true,
      center: true,
    },
    {
      name: 'Status',
      selector: (row) => row.Status,
      center: true,
      sortable: true,
    },
    {
      name: 'Action',
      selector: (row) => row.Action,
      center: true,
    },
  ]

  return (
    <>
      <CRow className="mt-1 mb-1">
        <CCol
          className="offset-md-6"
          xs={15}
          sm={15}
          md={6}
          style={{ display: 'flex', justifyContent: 'end' }}
        >
          <Link className="text-white" to="/DieselVendorMaster">
            <CButton size="md" color="warning" className="px-3 text-white" type="button">
              <span className="float-start">
                <i className="" aria-hidden="true"></i> &nbsp;NEW
              </span>
            </CButton>
          </Link>
        </CCol>
      </CRow>
      <CCard>
        <CustomTable
          columns={columns}
          data={rowData}
          fieldName={'diesel_Vendor_Name'}
          showSearchFilter={true}
          pending={pending}
        />
      </CCard>
    </>
  )
}

export default DieselVendorMasterTable
