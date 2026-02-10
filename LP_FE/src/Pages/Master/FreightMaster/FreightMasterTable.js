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
  CFormInput,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import CustomTable from 'src/components/customComponent/CustomTable'
import Loader from 'src/components/Loader'
//import DriverMasterService from 'src/Service/Master/DriverMasterService'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import CustomSpanButton from 'src/components/customComponent/CustomSpanButton1'
import FreightMasterService from 'src/Service/Master/FreightMasterService'
import FreightMasterTableImport from 'src/Pages/Master/FreightMaster/FreightMasterTableImport'
import { read, utils, writeFile } from 'xlsx';

const FreightMasterTable = () => {
  const [fetch, setFetch] = useState(false)
  const [rowData, setRowData] = useState([])
  const [mount, setMount] = useState(1)


  let viewData
  function changeFreightStatus(id) {
    FreightMasterService.deleteFreight(id).then((res) => {
      toast.success('Freight Rate Status Updated Successfully!')
      setMount((preState) => preState + 1)
    })
  }
  function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [day, month, year].join('-');
}
   useEffect(() => {
    FreightMasterService.getFreight().then((response) => {
      setFetch(true)
      viewData = response.data.data
       console.log(viewData)
      let rowDataList = []
      viewData.map((data, index) => {
        rowDataList.push({
          sno: index + 1,
          institution_customer_id: data.customer_info?.institution_customer_id,
          customer_name: data.customer_info?.customer_name,
          customer_code: data.customer_info?.customer_code,
          customer_type: data.customer_info?.customer_type,
          location_id: data.location_info?.location,
          freight_rate: data.freight_rate,
          type: data.type,
          start_date: data.start_date,
          end_date: data.end_date,
          created_at: data.created_at,
          Status: data.freight_status === 1 ? '✔️' : '❌',
          Action: (
            <div className="d-flex justify-content-space-between">
              <CButton
                size="sm"
                color="danger"
                shape="rounded"
                id={data.id}
                onClick={() => {
                  changeFreightStatus(data.id)
                }}
                className="m-1"
              >
                {/* Delete */}
                <i className="fa fa-trash" aria-hidden="true"></i>
              </CButton>
              <Link to={data.freight_status === 1 ? `FreightMaster/${data.id}` : ''}>
                <CButton
                  size="sm"
                  disabled={data.freight_status === 1 ? false : true}
                  color="secondary"
                  shape="rounded"
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
    })
  }, [mount])

  // ============ Column Header Data =======

  const columns = [
    {
      name: 'S.no',
      selector: (row) => row.sno,
      left: true,
      sortable: true,
    },


    {
      name: 'Customer Name',
      selector: (row) => row.customer_name,
      left: true,
      sortable: true,
    },
    {
      name: 'Customer Code',
      selector: (row) => row.customer_code,
      left: true,
      sortable: true,
    },
    {
      name: 'Customer type',
      selector: (row) => row.customer_type,
      left: true,
      sortable: true,
    },
    {
      name: 'Supplying Plant',
      selector: (row) => row.location_id,
      left: true,
      sortable: true,
    },

    {
      name: 'Freight Rate',
      selector: (row) => row.freight_rate,
      left: true,
      sortable: true,
    },
    {
      name: 'Supply Type',
      selector: (row) => row.type,
      left: true,
      sortable: true,
    },
    {
      name: 'Start Date',
      selector: (row) => formatDate(row.start_date),
      left: true,
      sortable: true,
    },
    {
      name: 'End Date',
      selector: (row) => formatDate(row.end_date),
      left: true,
      sortable: true,
    },
    {
      name: 'Status',
      selector: (row) => row.Status,
      left: true,
      sortable: true,
    },
    {
      name: 'Action',
      selector: (row) => row.Action,
      center: true,
    },
  ]

  //============ column header data=========

  return (
    <>
      {!fetch && <Loader />}
      {fetch && (
        <>
            <CCard className="mt-4">
            <CContainer className="mt-2">
            <CRow>
            <CCol
              className="offset-md-5"
              xs={15}
              sm={15}
              md={3}
              style={{ display: 'flex', justifyContent: 'end' }}
            >
            <div className="col-md-6">
                   <Link className="text-white" to="/FreightMasterTableImport">
                         <button className="btn btn-primary float-right">
                            Import <i className="fa fa-download"></i>
                          </button>
                   </Link>
                        </div>
               <Link className="text-white" to="/FreightMaster">
                <CButton size="md" color="warning" className="px-3 text-white" type="button">
                  <span className="float-start">
                    <i className="" aria-hidden="true"></i> &nbsp;NEW
                  </span>
                </CButton>
                </Link>

            </CCol>
           </CRow>


              <CustomTable
                columns={columns}
                data={rowData}
                showSearchFilter={true}
              />
            </CContainer>
          </CCard>


        </>
      )}
    </>
  )
}

export default FreightMasterTable
