import Axios from 'axios';
import React, { Component } from 'react';

import PortfolioSidebarList from "../portfolio/portfolio_sidebar_list";
import PortfolioForm from "../portfolio/portfolio-form";
import PortfolioItem from '../portfolio/portfolio-item';

export default class PortfolioManager extends Component {
    constructor() {
        super();

        this.state = {
            portfolioItems: [],
            portfolioToEdit: {}
        };


        this.handleNewFormSubmission = this.handleNewFormSubmission.bind(this);
        this.handleEditFormSubmission = this.handleEditFormSubmission.bind(this);
        this.handleFormSubmissionError = this.handleFormSubmissionError.bind(this);
        this.handleDeleteClick = this.handleDeleteClick.bind(this);
        this.handleEditClick = this.handleEditClick.bind(this);
        this.clearPortfolioToEdit = this.clearPortfolioToEdit.bind(this);
    }

    clearPortfolioToEdit() {
        this.setState({
            portfolioToEdit: {}
        });
    }

    handleEditClick(portfolioItem) {
        this.setState({
            portfolioToEdit: PortfolioItem
        })
    }

    handleDeleteClick(portfolioItem) {
        axios
            .delete(
                `https://api.devcamp.space/portfolio/portfolio_items/${portfolioItem.id}`,
                { withCredentials: true }
            )
            .then(response => {
                this.setState({
                    portfolioItems: this.state.portfolioItems.filter(item => {
                        return item.id !== portfolioItem.id;
                    })
                });

                return response.data;
            })
            .catch(error => {
                console.log("handleDeleteClick error", error);
            });
    }

    handleEditFormSubmission() {
        this.getPortfolioItems();
      }

    handleNewFormSubmission(portfolioItem) {
        this.setState({
            portfolioItems: [portfolioItem].concat(this.state.portfolioItems)
        });
    }

    handleFormSubmissionError(error) {
        console.log(error);
    }

    getPortfolioItems() {
        Axios.get("https://carlosgonzalez.devcamp.space/portfolio/portfolio_items?order_by=created_at&direction=desc",
            {
                withcredential: true
            })
            .then(Response => {
                this.setState({
                    portfolioItems: [...Response.data.portfolio_items]
                })
            })
            .catch(error => {
                console.log("error in portfoilioItems", error);
            })
    }

    componentDidMount() {
        this.getPortfolioItems();
    }

    render() {
        return (
            <div className="portfolio-manager-wrapper">
                <div className="left-column">
                    <PortfolioForm
                        handleNewFormSubmission={this.handleNewFormSubmission}
                        handleEditFormSubmission={this.handleEditFormSubmission}
                        handleFormSubmissionError={this.handleFormSubmissionError}
                        clearPortfolioToEdit={this.clearPortfolioToEdit}
                        portfolioToEdit={this.state.portfolioToEdit}
                    />
                </div>
                <div className="right-column">
                    <PortfolioSidebarList
                        handleDeleteClick={this.handleDeleteClick}
                        data={this.state.portfolioItems}
                        handleEditClick={this.handleEditClick}
                    />
                </div>
            </div>
        );
    }
}