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
import { Pagination } from "@material-ui/lab";
import Header from "./components/Header";
import swal from "sweetalert";
const axios = require("axios");

export default class SeekerDeleted extends Component {
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
      .get(`http://localhost:2000/seeker-get-deleted-request${data}`, {
        headers: {
          token: this.state.token,
        },
      })
      .then((res) => {
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

  reviveRequest = (id) => {
    axios
      .post(
        "http://localhost:2000/revive-request",
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

  addRequest = () => {
    // const fileInput = document.querySelector("#fileInput");
    const file = new FormData();
    // file.append('file', fileInput.files[0]);
    file.append("title", this.state.title);
    file.append("desc", this.state.desc);
    file.append("starttime", this.state.starttime);
    file.append("type", this.state.type);

    axios
      .post("http://localhost:2000/add-request", file, {
        headers: {
          "content-type": "multipart/form-data",
          token: this.state.token,
        },
      })
      .then((res) => {
        swal({
          text: res.data.title,
          icon: "success",
          type: "success",
        });

        this.handleRequestClose();
        this.setState(
          { title: "", desc: "", starttime: "", type: "", file: null, page: 1 },
          () => {
            this.getRequest();
          }
        );
      })
      .catch((err) => {
        swal({
          text: err.response.data.errorMessage,
          icon: "error",
          type: "error",
        });
        this.handleRequestClose();
      });
  };

  updateRequest = () => {
    const fileInput = document.querySelector("#fileInput");
    const file = new FormData();
    file.append("id", this.state.id);
    file.append("file", fileInput.files[0]);
    file.append("title", this.state.title);
    file.append("desc", this.state.desc);
    file.append("starttime", this.state.starttime);
    file.append("type", this.state.type);

    axios
      .post("http://localhost:2000/update-request", file, {
        headers: {
          "content-type": "multipart/form-data",
          token: this.state.token,
        },
      })
      .then((res) => {
        swal({
          text: res.data.title,
          icon: "success",
          type: "success",
        });

        this.handleRequestEditClose();
        this.setState(
          { title: "", desc: "", starttime: "", type_id: "", file: null },
          () => {
            this.getRequest();
          }
        );
      })
      .catch((err) => {
        swal({
          text: err.response.data.errorMessage,
          icon: "error",
          type: "error",
        });
        this.handleRequestEditClose();
      });
  };

  handleRequestOpen = () => {
    this.setState({
      openRequestModal: true,
      id: "",
      title: "",
      desc: "",
      type: "",
      starttime: "",
    });
  };

  handleRequestClose = () => {
    this.setState({ openRequestModal: false });
  };

  handleRequestEditOpen = (data) => {
    this.setState({
      openRequestEditModal: true,
      id: data._id,
      title: data.title,
      desc: data.desc,
      type: data.type,
      starttime: data.starttime,
      // fileName: data.image
    });
  };

  handleRequestEditClose = () => {
    this.setState({ openRequestEditModal: false });
  };

  render() {
    return (
      <>
        <Header />

        <div>
          {this.state.loading && <LinearProgress size={40} />}
          <div>
            <h2>Deleted Requests</h2>

            <Button
              className="button_style"
              variant="contained"
              size="small"
              onClick={this.logOut}
            >
              Log Out
            </Button>
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
                      {new Date(row.starttime).toLocaleString()}
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        className="button_style"
                        variant="outlined"
                        color="dark"
                        size="small"
                        onClick={(e) => this.reviveRequest(row._id)}
                      >
                        Revive
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
