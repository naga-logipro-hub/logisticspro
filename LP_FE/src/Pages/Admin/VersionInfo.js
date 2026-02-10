import { CAlert, CAlertHeading, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import { React } from 'react' 

const FIX = () => <span style={{color:"red", fontWeight:"bold"}}> [FIX] </span> 
const NEW = () => <span style={{color:"green", fontWeight:"bold"}}> [NEW] </span>
const ENHANCED = () => <span style={{color:"orange", fontWeight:"bold"}}> [ENHANCED]</span>

const VersionInfo = () => {

  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)

  /* Get User Id From Local Storage */
  const user_id = user_info.user_id

    const columns = [
        {
          key: 'id',
          label: '#',
          _props: { scope: 'col' },
        },
        {
          key: 'class',
          _props: { scope: 'col' },
        },
        {
          key: 'heading_1',
          label: 'Heading',
          _props: { scope: 'col' },
        },
        {
          key: 'heading_2',
          label: 'Heading',
          _props: { scope: 'col' },
        },
    ]
    const items = [
        {
          id: 1,
          class: 'Mark',
          heading_1: 'Otto',
          heading_2: '@mdo',
          _cellProps: { id: { scope: 'row' } },
        },
        {
          id: 2,
          class: 'Jacob',
          heading_1: 'Thornton',
          heading_2: '@fat',
          _cellProps: { id: { scope: 'row' } },
        },
        {
          id: 3,
          class: 'Larry the Bird',
          heading_2: '@twitter',
          _cellProps: { id: { scope: 'row' }, class: { colSpan: 2 } },
        },
    ]

    const styles = {
      container: {
        padding: "1rem",
        textAlign: "center",
        fontFamily: "Arial",
        
      },
      button: {
        display: "inline-block",
        // marginTop: "1rem",
        marginLeft: "55%",
        padding: "5px 10px",
        backgroundColor: "#007bff",
        color: "#fff",
        borderRadius: "5px",
        textDecoration: "none",
      }
    };
    
    //   return <CTable columns={columns} items={items} />
    return (
      <CAlert color="info">
        <CAlertHeading as="h4" color="red"><u><b>
          <span style={{color:"#4d3227"}}>LOGISTICS PRO</span></b></u>
          <div style={{display:"flex"}}>
            <a href="/changelog.pdf" download style={styles.button}>
              <i className="fa fa-download" aria-hidden="true"></i> &nbsp;Version Info.
            </a>
            {user_info.is_admin == 1 && 
            <a href="/LP_Flow.pdf" download style={{marginLeft:"5%"}}>
              <i className="fa fa-download" aria-hidden="true"></i> &nbsp;Scope & Flow
            </a>
            }
          </div>
        </CAlertHeading>
          
        <CTable style={{ height: '60vh', width: 'auto' }}>
          <CTableHead>
            <CTableRow> 
              <CTableHeaderCell style={{ width: '10%', textAlign: 'center' }} scope="col">Version</CTableHeaderCell>
              <CTableHeaderCell style={{ width: '10%', textAlign: 'center' }} scope="col">Date</CTableHeaderCell>
              <CTableHeaderCell scope="col">Changes</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            <CTableRow> 
              <CTableDataCell style={{ width: '10%', textAlign: 'center' }} >8.2.1</CTableDataCell>
              <CTableDataCell style={{ width: '10%', textAlign: 'center' }} >08-12-2025</CTableDataCell>
              <CTableDataCell> 
                <div style={{display:"block"}}>                                   
                  <div>
                    <NEW /> Vehicle Utilization Report
                  </div>        
                  <div>
                    <ENHANCED /> Expense, Income and Settlement Closure Screen Updates
                  </div>                  
                </div> 
              </CTableDataCell> 
            </CTableRow>
            <CTableRow> 
              <CTableDataCell style={{ width: '10%', textAlign: 'center' }} >8.2.0</CTableDataCell>
              <CTableDataCell style={{ width: '10%', textAlign: 'center' }} >15-11-2025</CTableDataCell>
              <CTableDataCell> 
                <div style={{display:"block"}}>                                   
                  <div>
                    <NEW /> Implementation of Hire Vehicle Freight Booking in NLCD Books
                  </div>
                  <div>
                    <ENHANCED /> Advance Payment Screen Updates 
                  </div> 
                  <div>
                    <ENHANCED /> Diesel Approval Screen Updates 
                  </div>           
                  <div>
                    <ENHANCED /> Income, Settlement Closure Screen Updates
                  </div> 
                   <div>
                    <ENHANCED /> FI Entry, Deduction and Payment Screen Updates 
                  </div>                  
                </div> 
              </CTableDataCell> 
            </CTableRow>
            <CTableRow> 
              <CTableDataCell style={{ width: '10%', textAlign: 'center' }} >8.1.0</CTableDataCell>
              <CTableDataCell style={{ width: '10%', textAlign: 'center' }} >17-10-2025</CTableDataCell>
              <CTableDataCell> 
                <div style={{display:"block"}}>                                   
                  <div>
                    <NEW /> Aruppukkottai Depo Implementation 
                  </div>
                  <div>
                    <NEW /> Rake Vendor Master Report 
                  </div>
                  <div>
                    <ENHANCED /> Diesel Confirmation Screen Updates 
                  </div>           
                  <div>
                    <ENHANCED /> Diesel Indent Report Updates
                  </div>                  
                </div> 
              </CTableDataCell> 
            </CTableRow>
            <CTableRow> 
              <CTableDataCell style={{ width: '10%', textAlign: 'center' }} >8.0.3</CTableDataCell>
              <CTableDataCell style={{ width: '10%', textAlign: 'center' }} >27-09-2025</CTableDataCell>
              <CTableDataCell> 
                <div style={{display:"block"}}>                                   
                  <div>
                    <ENHANCED /> Doc. Verification : Fetch Multiple Vendor Info against PAN No. 
                  </div>
                  <div>
                    <ENHANCED /> Vendor Creation : Fetch Multiple Vendor Info against PAN No. 
                  </div>   
                  <div>
                    <ENHANCED /> Freight Vendor Change : Fetch Multiple Vendor Info against PAN No.
                  </div>                     
                  <div>
                    <ENHANCED /> Rake FNR Report Updates
                  </div>
                  <div>
                    <ENHANCED /> Tripsheet / Accounts Info. Report Updates 
                  </div>
                </div> 
              </CTableDataCell> 
            </CTableRow>
            <CTableRow> 
              <CTableDataCell style={{ width: '10%', textAlign: 'center' }} >8.0.2</CTableDataCell>
              <CTableDataCell style={{ width: '10%', textAlign: 'center' }} >23-09-2025</CTableDataCell>
              <CTableDataCell> 
                <div style={{display:"block"}}>                                     
                  <div>
                    <NEW /> Tripsheet Cancel Option for Party Vehicles
                  </div>  
                  <div>
                    <NEW /> Admin - Tripsheet Diesel Vendor Change Option
                  </div> 
                  <div>
                    <ENHANCED /> New Depo Plant Updates for Aruppukkottai
                  </div>
                  <div>
                    <ENHANCED /> Export Option for all the Depo Masters
                  </div>   
                  <div>
                    <ENHANCED /> New Diesel Vendor Updates for NLFS
                  </div>                     
                  
                </div> 
              </CTableDataCell> 
            </CTableRow>
            <CTableRow> 
              <CTableDataCell style={{ width: '10%', textAlign: 'center' }} >8.0.1</CTableDataCell>
              <CTableDataCell style={{ width: '10%', textAlign: 'center' }} >21-08-2025</CTableDataCell>
              <CTableDataCell> 
                <div style={{display:"block"}}>                                     
                  <div>
                    <NEW /> Admin - Trip Purpose Change Option
                  </div>  
                  <div>
                    <ENHANCED /> Expense / Income Closure Screen Updates
                  </div>
                  <div>
                    <ENHANCED /> Vendor Code Display in Tripsheet Smartform
                  </div>  
                  <div>
                    <ENHANCED /> Depo Tripsheet Report Updates
                  </div>  
                  
                </div> 
              </CTableDataCell> 
            </CTableRow>
            <CTableRow> 
              <CTableDataCell style={{ width: '10%', textAlign: 'center' }} >8.0.0</CTableDataCell>
              <CTableDataCell style={{ width: '10%', textAlign: 'center' }} >20-07-2025</CTableDataCell>
              <CTableDataCell> 
                <div style={{display:"block"}}>                                     
                  <div>
                    <NEW /> Masters View Access Provide to the Users 
                  </div> 
                  <div>
                    <NEW /> Others Process : FG-Sales Return, RM Sales, Delivery Challan Process Captured
                  </div> 
                  <div>
                    <ENHANCED /> Rake Vendor Master Updates
                  </div>
                  <div>
                    <ENHANCED /> Vendor Code Creation Updates
                  </div>  
                  <div>
                    <ENHANCED /> Others Tripsheet Division Details stored in SAP
                  </div>
                  <div>
                    <ENHANCED /> Sales Type maintained as master
                  </div>
                  
                </div> 
              </CTableDataCell> 
            </CTableRow>
            <CTableRow> 
              <CTableDataCell style={{ width: '10%', textAlign: 'center' }} >7.3.0</CTableDataCell>
              <CTableDataCell style={{ width: '10%', textAlign: 'center' }} >17-06-2025</CTableDataCell>
              <CTableDataCell> 
                <div style={{display:"block"}}>                                     
                  <div>
                    <NEW /> Tripsheet Freight Vendor Change Process 
                  </div> 
                  <div>
                    <NEW /> New Pending Bills Follow-Up & Capture Report
                  </div> 
                  <div>
                    <ENHANCED /> FCI Vendor Creation - Validation Relaxation
                  </div>
                  <div>
                    <ENHANCED /> Nav Bar Adjustments for Rake, Depo, FCI, IFoods Process
                  </div>  
                  <div>
                    <ENHANCED /> Diesel Indent Process - Confirmation & Approval Date Capture
                  </div>
                  
                </div> 
              </CTableDataCell> 
            </CTableRow>
            <CTableRow> 
              <CTableDataCell style={{ width: '10%', textAlign: 'center' }} >7.2.1</CTableDataCell>
              <CTableDataCell style={{ width: '10%', textAlign: 'center' }} >26-05-2025</CTableDataCell>
              <CTableDataCell> 
                <div style={{display:"block"}}> 
                  <div>
                    <NEW /> New Invoice Attachment Report
                  </div> 
                  <div>
                    <ENHANCED /> Own Vehicles Trip Info Capture Report Adjustments
                  </div>  
                  <div>
                    <FIX /> OVTIC - RJ Report Adjustments.
                  </div>
                   <div>
                    <FIX /> NLFD & NLCD Invoice Report Adjustments
                  </div>
                  <div>
                    <FIX /> DT Despatch Screen & Report Adjustments.
                  </div>
                </div> 
              </CTableDataCell> 
            </CTableRow>
            <CTableRow> 
              <CTableDataCell style={{ width: '10%', textAlign: 'center' }} >7.2.0</CTableDataCell>
              <CTableDataCell style={{ width: '10%', textAlign: 'center' }} >20-05-2025</CTableDataCell>
              <CTableDataCell> 
                <div style={{display:"block"}}>
                  <div>
                    <NEW /> DT Despatch Screen & Report 
                  </div>
                  <div>
                    <NEW /> New OVTIC - RJ Report
                  </div>
                  <div>
                    <ENHANCED /> NLFD & NLCD Invoice Report Adjustments 
                  </div>
                  <div>
                    <ENHANCED /> Own Vehicles Trip Info Capture Report & HVITW Freight Report Adjustments
                  </div>  
                  <div>
                    <FIX /> Expense Closure RCM should be as Advance RCM, if advance completed.
                  </div>
                  <div>
                    <FIX /> Mismatched Shipment Qty issue in Delivery Tracking Report
                  </div>
                </div> 
              </CTableDataCell> 
            </CTableRow>
            <CTableRow> 
              <CTableDataCell style={{ width: '10%', textAlign: 'center' }} >7.1.1</CTableDataCell>
              <CTableDataCell style={{ width: '10%', textAlign: 'center' }} >30-04-2025</CTableDataCell>
              <CTableDataCell> 
                <div style={{display:"block"}}>
                  <div>
                    <NEW /> Forgot Password Option Via Mobile Otp 
                  </div>
                  <div>
                    <ENHANCED /> Auto Mail Configation Adjustments 
                  </div>  
                </div> 
              </CTableDataCell> 
            </CTableRow>
            
            <CTableRow> 
              <CTableDataCell style={{ width: '10%', textAlign: 'center' }} >7.1.0</CTableDataCell>
              <CTableDataCell style={{ width: '10%', textAlign: 'center' }} >09-04-2025</CTableDataCell>
              <CTableDataCell> 
                <div style={{display:"block"}}>
                  <div>
                    <NEW /> Incoterm Wise Freight Report 
                  </div>
                  <div>
                    <NEW /> App Maintainence Mode Enabled
                  </div>
                  <div>
                    <ENHANCED /> Advance Payment , Expense Closure Screen Fields 
                  </div> 
                  <div>
                    <FIX /> Expense Closure & TIC Report Field issue
                  </div>
                </div> 
              </CTableDataCell> 
            </CTableRow>
            <CTableRow> 
              <CTableDataCell style={{ width: '10%', textAlign: 'center' }} >7.0.3</CTableDataCell>
              <CTableDataCell style={{ width: '10%', textAlign: 'center' }} >05-04-2025</CTableDataCell>
              <CTableDataCell> 
                <div style={{display:"block"}}>
                  <div>
                    <ENHANCED /> Rake FNR Report  
                  </div>  
                </div> 
              </CTableDataCell> 
            </CTableRow>
            <CTableRow> 
              <CTableDataCell style={{ width: '10%', textAlign: 'center' }} >7.0.2</CTableDataCell>
              <CTableDataCell style={{ width: '10%', textAlign: 'center' }} >23-03-2025</CTableDataCell>
              <CTableDataCell> 
                <div style={{display:"block"}}>
                  <div>
                    <ENHANCED /> Admin Settings , TIC Screen Options  
                  </div> 
                  <div>
                    <FIX /> Expense Closure & TIC Report Field issue
                  </div>
                </div> 
              </CTableDataCell> 
            </CTableRow>
            <CTableRow> 
              <CTableDataCell style={{ width: '10%', textAlign: 'center' }} >7.0.1</CTableDataCell>
              <CTableDataCell style={{ width: '10%', textAlign: 'center' }} >03-03-2025</CTableDataCell>
              <CTableDataCell> 
                <div style={{display:"block"}}>
                  <div>
                    <ENHANCED /> RCM Gst-Tax Types  
                  </div> 
                  <div>
                    <FIX /> Low Tonnage cost calculated twice while income generated
                  </div>
                </div> 
              </CTableDataCell>
            </CTableRow>  
            <CTableRow> 
              <CTableDataCell style={{ width: '10%', textAlign: 'center' }} >7.0.0</CTableDataCell>
              <CTableDataCell style={{ width: '10%', textAlign: 'center' }} >02-09-2024</CTableDataCell>
              <CTableDataCell><NEW /> Vehicle Report Screens where the information fetched from Black Box API list</CTableDataCell>
            </CTableRow>
            <CTableRow> 
                <CTableDataCell style={{ width: '10%', textAlign: 'center' }} >6.0.0</CTableDataCell>
                <CTableDataCell style={{ width: '10%', textAlign: 'center' }} >01-08-2024</CTableDataCell>
                <CTableDataCell><NEW /> FCI Process data Capturing, BDC Bulk/Single upload for Tripsheet Creation, Vendor Expense, Logistics Income & Deduction and Payment posting against Rake Payment Sequence No, Reports</CTableDataCell>
            </CTableRow>
            <CTableRow> 
              <CTableDataCell style={{ width: '10%', textAlign: 'center' }} >5.0.0</CTableDataCell>
              <CTableDataCell style={{ width: '10%', textAlign: 'center' }} >01-12-2023</CTableDataCell>
              <CTableDataCell><NEW />NON Tripsheet / Others Process data Capturing, Tripsheet Creation, Vendor Expense, Logistics Income & Deduction and Payment posting against Rake Payment Sequence No, Reports</CTableDataCell>
            </CTableRow>
            <CTableRow> 
              <CTableDataCell style={{ width: '10%', textAlign: 'center' }} >4.0.0</CTableDataCell>
              <CTableDataCell style={{ width: '10%', textAlign: 'center' }} >01-10-2023</CTableDataCell>
              <CTableDataCell><NEW /> IFoods Entries Capturing, Vehicles Gate-In, Shipment Creation, Expense & Income Submission, Payment Entry Posting, Reports</CTableDataCell>
            </CTableRow>
            <CTableRow> 
              <CTableDataCell style={{ width: '10%', textAlign: 'center' }} >3.0.0</CTableDataCell>
              <CTableDataCell style={{ width: '10%', textAlign: 'center' }} >22-08-2023</CTableDataCell>
              <CTableDataCell><NEW />  Rake Process data Capturing, BDC Bulk/Single upload for Tripsheet Creation, Vendor Expense, Logistics Income & Deduction and Payment posting against Rake Payment Sequence No, Reports</CTableDataCell>
            </CTableRow>
            <CTableRow> 
              <CTableDataCell style={{ width: '10%', textAlign: 'center' }} >2.0.0</CTableDataCell>
              <CTableDataCell style={{ width: '10%', textAlign: 'center' }} >27-03-2023</CTableDataCell>
              <CTableDataCell><NEW /> Depo Vehicles Gate-In, Shipment Creation, Expense & Income Submission, Payment Entry Posting, Reports</CTableDataCell>
            </CTableRow>
            <CTableRow> 
              <CTableDataCell style={{ width: '10%', textAlign: 'center' }} >1.0.0</CTableDataCell>
              <CTableDataCell style={{ width: '10%', textAlign: 'center' }} >01-10-2022</CTableDataCell>
              <CTableDataCell>New Realease</CTableDataCell>
            </CTableRow>
          </CTableBody>
        </CTable>
        <hr />
      </CAlert>
    )
}

export default VersionInfo

 

