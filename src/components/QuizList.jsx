import Nav from './Nav'
import '../styles/QuizList.css';
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toggleStatus, } from '../service/Actions/action';
import { Link } from 'react-router-dom';
import { dltQ } from '../service/Actions/action';
import CreateMcqSingle from './CreateMcqSingle';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Switch from '@mui/material/Switch';
import { styled } from '@mui/material/styles';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import Modal from '@mui/joy/Modal';
import CloseIcon from '@mui/icons-material/Close';
import { Button } from '@mui/material';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import { jwtDecode } from 'jwt-decode';

// code for ios style switch button as active toggle button
const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) =>
({
  width: 38,
  height: 22,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.mode === 'dark' ? '#65ceb5' : '#65ceb5',
        opacity: 1,
        border: 0,
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '6px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color:
        theme.palette.mode === 'light'
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 18,
    height: 18,
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === 'light' ? '#b7b7b7' : '#b7b7b7',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
  },
}));

// Table component displaying the quiz data
export const QuizList = (props) => {
  //  flag to toggle between modal and non-modal mode
  // const isModal = Object.keys(props).length !== 0;
  const isModal = props.modal === '1';

  // flag to open/close delete confirmation modal
  const [openDlt, setOpenDlt] = useState(false);
  // flag to open/close question type selection modal
  const [openCreate, setOpenCreate] = useState(false);
  // flag to open/close edit quiz modal
  const [openEdt, setOpenEdt] = useState(false);
  // flag to show message if there are 0 active quizzes 
  const [showList, setShowList] = useState(false);

  // store the quiz index to delete
  const [dltIndex, setDltIndex] = useState();
  // store the quiz index to edit
  const [edtIndex, setEdtIndex] = useState();
  // store the user data
  const [user, setUser] = useState(() => {
    let userObj = jwtDecode(localStorage.getItem("token"));
    userObj.firstLetter = userObj.name.charAt(0);
    return(userObj);
  });

  // [Page 1-> Home | Page 2-> Quiz List] it is used in the navbar for highlighting the links
  const page = 2;
  // store the number of In-active quizzes
  let noOfNotActive = 0;
  // store the number of quizzes
  let noOfQuizzes = 0;

  // store the quizzes from the store
  const quizzes = useSelector(state => state.quizzes);
  // dispatch to dispatch any actions
  const dispatch = useDispatch();

  // function to handle open/close of delete confirmation modal
  const handleOpenDlt = () => setOpenDlt(true);
  const handleCloseDlt = () => setOpenDlt(false);

  // function to handle open/close of edit modal
  const handleOpenEdt = () => setOpenEdt(true);
  const handleCloseEdt = (event, reason) => {
    if (((reason) === "backdropClick") || ((reason) === "escapeKeyDown"))
      return;
    setOpenEdt(false);
  }

  // function to handle open/close of question type selection modal
  const handleOpenCreate = () => setOpenCreate(true);
  const handleCloseCreate = () => setOpenCreate(false);

  // setting noOfQuizzes and noOfNotActive and ShowList to true/false on 1st render
  noOfQuizzes = quizzes.length;

  useEffect(() => {
    quizzes.forEach((quiz) => {
      if (!quiz.status)
        noOfNotActive++;
    })
    if (isModal) {
      if (noOfNotActive === noOfQuizzes) {
        setShowList(false);
      }
      else {
        setShowList(true);
      }
    }
    else {
      setShowList(true);
    }
    // eslint-disable-next-line
  }, []);

  return (
    <div className='quizzes-page'>

      <Nav active={isModal ? '0' : page} user={user} />

      <div className={isModal ? "hide" : "quiz-top-container"}>
        <div className='quiz-top'>
          <div className='quiz-head'>
            My Quizzes
          </div>
          <div className='create-quiz-link' onClick={handleOpenCreate}>
            Create New Quiz
          </div>
        </div>
      </div>

      <div className={isModal ? "table-container-modal" : "table-container"}>
        {/* If no of quizzes is 0 then display  " No quizzes to show , Please create one first "*/}
        {/* Else if showList is true then display the list of quizzes else display " No quizzes are ACTIVE to Play " */}
        {
          noOfQuizzes === 0 ?
            <div className='empty-quizzes'>
              No quizzes to show , Please create one first
            </div>
            :
            !showList ?
              <div className='empty-quizzes'>
                No quizzes are ACTIVE to Play
              </div>
              :
              <TableContainer component={Paper} className="table-modal" >
                <Table>

                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontFamily: "BrandonGrotesque-Bold", fontSize: '25px' }}>Quiz&nbsp;No.</TableCell>
                      <TableCell align="left" >Title</TableCell>
                      <TableCell align="left" className={isModal ? "hide" : ""} >Status</TableCell>
                      <TableCell align="left" >Modified&nbsp;on</TableCell>
                      <TableCell align="left" >Actions</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {quizzes.map((quiz, index) => {
                      return (
                        <TableRow
                          key={index}
                          className={quiz.status ? "" : isModal ? "hide" : "inactive"}
                        >

                          <TableCell align="left" >{index + 1}</TableCell>
                          <TableCell align="left" >{quiz.title}</TableCell>
                          <TableCell align="left" sx={{ display: "flex", alignItems: "center", fontFamily: "BrandonGrotesque-Bold", fontSize: '20px' }} className={isModal ? "hide" : "status-container"}>
                            <span className='status' >{quiz.status ? "Active" : "Inactive"}</span>
                            <span>
                              {
                                <IOSSwitch
                                  sx={{ m: 1 }}
                                  checked={quiz.status}
                                  onChange={async (e) => {
                                    dispatch(toggleStatus(e.target.checked, index));
                                  }} />
                              }
                            </span>
                          </TableCell>
                          <TableCell align="left" >{quiz.date}</TableCell>
                          <TableCell align="left" >
                            {/* Play icon btn */}
                            <Link to="/play" state={{ id: index }}>
                              <button title='Play' className={!quiz.status ? "fade" : "actions"} disabled={!quiz.status}>
                                <PlayCircleOutlineIcon sx={{ color: "green" }} />
                              </button>
                            </Link>

                            {/* Edit icon btn to open edit modal */}
                            <button title='Edit' className={isModal ? "hide" : "actions"} id='editBtn' onClick={() => {
                              handleOpenEdt();
                              setEdtIndex(index);
                            }}>
                              <BorderColorOutlinedIcon sx={{ color: "green" }} />
                            </button>

                            {/* Delete icon btn to open delete confirmation modal */}
                            <button title='Delete' className={isModal ? "hide" : "actions"} onClick={() => {
                              handleOpenDlt();
                              setDltIndex(index);
                            }}>
                              <DeleteOutlinedIcon sx={{ color: "crimson" }} />
                            </button>

                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
        }
      </div>

      {/* Modal for question type selection */}
      <Modal
        open={openCreate}
        onClose={handleCloseCreate}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <div className='modalH'>
          <div id='modalH-title'>
            <span>Select Question Type</span>
            <button onClick={handleCloseCreate}><CloseIcon /></button>
          </div>
          <div id='modalH-description'>
            <Link to='/mcq-single'>
              <button className='types' value='1'>
                <span>MCQ</span> (Single Correct)
              </button>
            </Link>
            <button className='types' value='2'>
              <span>MCQ</span> (Multi Correct)
            </button>
            <button className='types' value='3'>
              <span>Short Answer</span> (with two words)
            </button>
            <button className='types' value='4'>
              <span>Description</span> (with 2 or 4 sentences)
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal for Editing the quiz */}
      <Modal
        open={openEdt}
        onClose={(event, reason) => handleCloseEdt(event, reason)}
        aria-labelledby="modal-title-edt"
        aria-describedby="modal-description-edt"
      >
        <div>
          <CreateMcqSingle editId={edtIndex} handleCloseEdt={handleCloseEdt} modal='1' />
        </div>
      </Modal>

      {/* Modal for delete confirmation */}
      <Modal
        open={openDlt}
        onClose={handleCloseDlt}
        aria-labelledby="modal-title-dlt"
        aria-describedby="modal-description-dlt"
      >
        <div className='modal-dlt'>
          <div id='modal-title-dlt'>
            <div className='modal-head-dlt'>
              Are you sure you want to Delete
            </div>
            <button onClick={handleCloseDlt} className='close-btn'><CloseIcon /></button>
          </div>
          <div id='modal-description-dlt'>
            <div>
              Deleting this quiz will result in loosing the quiz permanently and is not recoverable
            </div>
            <div>
              <Button
                sx={{
                  backgroundColor: "crimson",
                  float: "right",
                  marginLeft: "20px",
                  marginTop: "20px",
                  fontFamily: "BrandonGrotesque-Bold"
                }}
                onClick={handleCloseDlt}
                color='error'
                size='large'
                variant='contained'>
                No
              </Button>
              <Button
                sx={{
                  backgroundColor: "crimson",
                  float: "right",
                  marginTop: "20px",
                  fontFamily: "BrandonGrotesque-Bold"
                }}
                onClick={() => {
                  dispatch(dltQ(dltIndex));
                  setDltIndex(null);
                  handleCloseDlt();
                }}
                color='error'
                size='large'
                variant='contained'>
                Yes
              </Button>
            </div>
          </div>
        </div>
      </Modal>

    </div>
  )
}


export default QuizList