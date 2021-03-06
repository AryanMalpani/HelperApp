import React, { Component } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  LinearProgress,
  DialogTitle,
  DialogContent,
  TableBody,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
} from "@material-ui/core";
import Header_volunteer from "./components/Header_volunteer";
import { Pagination } from "@material-ui/lab";
import swal from "sweetalert";
const axios = require("axios");

export default class VolunteerDash extends Component {
  constructor() {
    super();
    this.state = {
      token: "",
      openRequestModal: false,
      openRequestEditModal: false,
      id: "",
      title: "",
      desc: "",
      type: "",
      starttime: "",
      seekername: "",
      file: "",
      fileName: "",
      page: 1,
      search: "",
      requests: [],
      pages: 0,
      loading: false,
    };
  }

  componentDidMount = () => {
    let token = localStorage.getItem("token");
    if (!token) {
      this.props.history.push("/login");
    } else {
      this.setState({ token: token }, () => {
        this.getRequest();
      });
    }
  };

  getRequest = () => {
    this.setState({ loading: true });

    let data = "?";
    data = `${data}page=${this.state.page}`;
    if (this.state.search) {
      data = `${data}&search=${this.state.search}`;
    }
    axios
      .get(`http://localhost:2000/volunteer-get-request${data}`, {
        headers: {
          token: this.state.token,
        },
      })
      .then((res) => {
        console.log(res.data.requests[0].seeker_id.username);
        this.setState({
          loading: false,
          requests: res.data.requests,
          pages: res.data.pages,
        });
      })
      .catch((err) => {
        swal({
          text: err.response.data.errorMessage,
          icon: "error",
          type: "error",
        });
        this.setState({ loading: false, requests: [], pages: 0 }, () => {});
      });
  };

  acceptRequest = (id) => {
    axios
      .post(
        "http://localhost:2000/accept-request",
        {
          id: id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            token: this.state.token,
          },
        }
      )
      .then((res) => {
        swal({
          text: res.data.title,
          icon: "success",
          type: "success",
        });

        this.setState({ page: 1 }, () => {
          this.pageChange(null, 1);
        });
      })
      .catch((err) => {
        swal({
          text: err.response.data.errorMessage,
          icon: "error",
          type: "error",
        });
      });
  };

  pageChange = (e, page) => {
    this.setState({ page: page }, () => {
      this.getRequest();
    });
  };

  logOut = () => {
    localStorage.setItem("token", null);
    this.props.history.push("/");
  };

  onChange = (e) => {
    if (e.target.files && e.target.files[0] && e.target.files[0].name) {
      this.setState({ fileName: e.target.files[0].name }, () => {});
    }
    this.setState({ [e.target.name]: e.target.value }, () => {});
    if (e.target.name == "search") {
      this.setState({ page: 1 }, () => {
        this.getRequest();
      });
    }
  };

  handleRequestOpen = () => {
    this.setState({
      openRequestModal: true,
      id: "",
      title: "",
      desc: "",
      type: "",
      starttime: "",
      seekername: "",
    });
  };

  handleRequestClose = () => {
    this.setState({ openRequestModal: false });
  };

  // handleRequestEditOpen = (data) => {
  //   this.setState({
  //     openRequestEditModal: true,
  //     id: data._id,
  //     title: data.title,
  //     desc: data.desc,
  //     type: data.type,
  //     starttime: data.starttime,
  //     seekername : data.seeker_id.username

  //     fileName: data.image
  //   });
  // };

  handleRequestEditClose = () => {
    this.setState({ openRequestEditModal: false });
  };

  render() {
    return (
      <>
        <Header_volunteer />

        <div>
          {this.state.loading && <LinearProgress size={40} />}
          <div>
            <h2>Volunteer Dashboard</h2>
            {/* <Button
        className="button_style"
        variant="contained"
        color="primary"
        size="small"
        onClick={this.handleRequestOpen}
        >
        Add Request
    </Button> */}
            <Button
              className="button_style"
              variant="contained"
              size="small"
              onClick={this.logOut}
            >
              Log Out
            </Button>
          </div>

          <div>
            <table style={{ width: "100%" }}>
              <tr>
                <td>2 Available requests</td>
                <td>1 Accepted requests</td>
                <td>1 Completed requests</td>
              </tr>
            </table>
          </div>

          <br />

          <TableContainer>
            <TextField
              id="standard-basic"
              type="search"
              autoComplete="off"
              name="search"
              value={this.state.search}
              onChange={this.onChange}
              placeholder="Search by title"
              required
            />
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">Title</TableCell>
                  {/* <TableCell align="center">Image</TableCell> */}
                  <TableCell align="center">Description</TableCell>
                  <TableCell align="center">Type</TableCell>
                  <TableCell align="center">Seeker Name</TableCell>
                  <TableCell align="center">Age</TableCell>
                  <TableCell align="center">Start Time</TableCell>

                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.requests.map((row) => (
                  <TableRow key={row.title}>
                    <TableCell align="center" component="th" scope="row">
                      {row.title}
                    </TableCell>
                    {/* <TableCell align="center"><img src={`http://localhost:2000/${row.image}`} width="70" height="70" /></TableCell> */}
                    <TableCell align="center">{row.desc}</TableCell>
                    <TableCell align="center">{row.type_id.typename}</TableCell>
                    <TableCell align="center">
                      {row.seeker_id.fname + " " + row.seeker_id.lname}
                    </TableCell>
                    <TableCell align="center">{row.seeker_id.age}</TableCell>
                    <TableCell align="center">
                      {new Date(row.starttime).toLocaleString()}
                    </TableCell>

                    <TableCell align="center">
                      <Button
                        className="button_style"
                        variant="outlined"
                        color="success"
                        size="small"
                        onClick={(e) => this.acceptRequest(row._id)}
                      >
                        Accept
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <br />
            <Pagination
              count={this.state.pages}
              page={this.state.page}
              onChange={this.pageChange}
              color="primary"
            />
          </TableContainer>
        </div>
      </>
    );
  }
}
