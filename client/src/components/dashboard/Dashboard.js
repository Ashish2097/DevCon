import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { getCurrentProfile } from "./../../actions/profileActions";
import { PropTypes } from "prop-types";
import Spinner from "./../common/Spinner";

class Dashboard extends Component {
    componentDidMount() {
        this.props.getCurrentProfile();
    }
    render() {
        const {
            auth: { user },
            profile: { profile, loading },
        } = this.props;

        let dashboardContent;

        if (!profile || loading) dashboardContent = <Spinner />;
        else {
            // Check if logged in user has profile data
            if (Object.keys(profile).length > 0) {
                dashboardContent = <div> todo : display profile</div>;
            } else {
                // User has no Profile
                dashboardContent = (
                    <div>
                        <p className="lead text-muted">Welcome {user.name}</p>
                        <p>
                            You have not yet setup a proflie, please add some
                            info
                        </p>
                        <Link
                            to="/create-profile"
                            className="btn btn-lg btn-info"
                        >
                            Create Profile
                        </Link>
                    </div>
                );
            }
        }

        return (
            <div className="dashboard">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <h1 className="display-4">Dashboard</h1>
                            {dashboardContent}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

Dashboard.proptype = {
    getCurrentProfile: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
    profile: state.profile,
    auth: state.auth,
});

export default connect(mapStateToProps, { getCurrentProfile })(Dashboard);
