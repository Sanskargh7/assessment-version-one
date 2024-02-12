'use strict'
// export default ShowResult;
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/auth";
import Spinner from "./Spinner";
import * as moment from 'moment'

const ExamList = () => {
	const search = useLocation().search;
	const userId = new URLSearchParams(search).get("userId");
	const [DoneExams, setDoneExams] = useState({});
	const [PendingExams, setPendingExams] = useState({});
	const [isLoading, setIsLoading] = useState(true);
	const [auth, setAuth] = useAuth();
	const [Passcode, setPasscode] = useState("");
	const navigate = useNavigate();
	const [UserReport, setUserReport] = useState({});
	const [isPending, setIsPending] = useState(false);
	const [pendingSlug, setPendingSlug] = useState("");
	const [examName, setExamName] = useState("");
	const [pendingExamDate, setPendingExamDate] = useState("");
	const [PendingExamsCount, setPendingExamsCount] = useState();

	const viewExamHandler = async (slug) => {
		const { data } = await axios.post('/api/v2/user-score', {
			userId: userId,
			exam_name: slug
		})
		if (data) {
			setUserReport(data);

		}
	}

	//check pending exam
	const isPendingExam = async () => {
		const { data } = await axios.post('/api/v2/pending-exam', {
			userId: userId
		})
		if (data.success) {
			//console.log(data)
			setPendingExamsCount(data.responseCount)
			setIsPending(true);
			setPendingSlug(data.slug);
			setExamName(data.name);
			setPendingExamDate(data.createdAt);
		}

	}
	//pending exam start handler
	const pendingExamHandler = () => {
		//console.log(PendingExamsCount)
		if (PendingExamsCount < 3) {

			setAuth({ ...auth, type: pendingSlug, exam_name: examName });
			navigate("/home")
		} else {
			toast.error("Sorry Please contact Admin!")
		}
	}
	//fetch user score
	const getUserScore = async () => {
		try {
			const { data } = await axios.post(
				"/api/v2/exam-types",
				{
					userId: userId,
				}
			);


			if (data) {
				
				
				setDoneExams(data.data);
				setPendingExams(data.pendingExams);
				setIsLoading(false);

			}
		} catch (error) {
			console.log(error.message)
			// window.location.href = "https://www.inboundacademy.in/";
		}
	};
	const validatePassCodeHandler = async () => {
		try {
			const { data } = await axios.get(`/api/v2/validate/pass-code?passCode=${Passcode}`);

			if (data.success) {

				setAuth({ ...auth, type: data.data.slug, exam_name: data.data.exam_name })


				navigate('/home')
			} else {
				toast.error(data.msg);
			}
		} catch (error) {
			toast.error("Something Went Wrong!")
		}

	}
	useEffect(() => {

		if (userId) {
			getUserScore();
			isPendingExam();

		} else {

			navigate('/login')
		}
		// eslint-disable-next-line
	}, []);


	return (
		<>
			{isLoading ? (
				<Spinner />
			) : (
				<div class="content_wraper">
					<div class="logo">
						<div class="container">
							<a target="_blank" href="https://www.inboundacademy.in/">
								<img src="images/inbound-academy-logo.webp" alt="Logo" />
							</a>
						</div>
					</div>
					<div class="body_content result_page result_page_exam">
						<div class="container">
							<div class="exam_start border_r5">
								<div class="exam_result_lists_q">
									<div class="exam_result_header">
										<div className="exam_title_form">
										  <div className="lst_title">
										    Exam List 
										  </div>
											
										  <div className="lst_form">
											{
												isPending ? '' :
												<div className="passcode_form">
													<input type="text" placeholder="Please enter passcode"
														defaultValue={Passcode}
														name="passcode"
														onChange={(e) => setPasscode(e.target.value)} />
													<button className="btn btn-secondry start-btn"
														onClick={validatePassCodeHandler}
													>Start Exam</button>
												</div>
											}
										  </div>
										</div>
										<div class="exam_tag_line exam_list_act p-0">
											<div class="exam_list_tab m-0">
												<table width="100%" border="0" cellSpacing="0">
													<thead>
														<tr>
															<th className="text-center" width="8%">S No.</th>
															<th width="22%" align="left">Name</th>
															<th width="15%" className="text-center">Percentage</th>
															<th width="15%" className="text-center">Score</th>
															<th width="15%" className="text-center">Date</th>
															<th width="15%" className="text-center">Status</th>
															<th width="10%" className="text-center">Action</th>

														</tr>
													</thead>
													{isPending || DoneExams.length >= 1 ?
														<tbody>
															{
																isPending ? <tr>

																	<td className="incomplete_td" align="center">1</td>
																	<td className="incomplete_td cat-blog">{examName}</td>
																	<td align="center" className="incomplete_td cat-blog">-</td>
																	<td align="center" className="incomplete_td cat-blog">-</td>
																	<td align="center" className="incomplete_td cat-blog">{moment(pendingExamDate).format('DD-MM-YYYY')}</td>
																	<td align="center" className="incomplete_td">
																		<span className="levelincomplete">Incomplete</span>
																	</td>
																	<td className="incomplete_td" align="center">
																		<button className="sm_link" onClick={pendingExamHandler}>Resume</button>
																	</td>

																</tr> : ''
															}

															{
																DoneExams.map((value, index) => (
																	<tr key={index}>
																		<td className="complete_td" align="center">{(isPending)?index+2:index+1}</td>
																		<td className="complete_td cat-blog">{value.exam_name}</td>
																		<td align="center" className="complete_td cat-blog">{value.user_percentage} %</td>
																		<td align="center" className="complete_td cat-blog">{value.marks_Obtained}</td>
																	<td align="center" className="complete_td cat-blog">{moment(value.createdAt).format('DD-MM-YYYY')}</td>
																		<td className="complete_td" align="center">
																			<span className="levelcomplete">Complete</span>
																		</td>
																		<td className="complete_td" align="center">
																			<button className="sm_link"
																				type="button"
																				data-bs-toggle="modal"
																				data-bs-target="#exampleModal"
																				onClick={() => viewExamHandler(value.examType)}
																			>Full Result</button>

																		</td>

																	</tr>

																))
															}



														</tbody> : <tbody>
															<td style={{ fontSize: '20px' }} align="center" colSpan={3}><img src="/images/notFound.gif" alt="" /></td>

														</tbody>

													}
													{/* } */}

												</table>
											</div>
										</div>
									</div>

								</div>
							</div>
						</div>
					</div>
					<footer class="text-center">
						<div class="container">
							Copyright © 2024.{" "}
							<a href="https://www.transfunnel.com/" target="_blank">
								TransFunnel Consulting
							</a>
						</div>
					</footer>
				</div>

			)}

			<div
				class="modal fade"
				id="exampleModal"
				tabindex="-1"
				aria-labelledby="exampleModalLabel"
				aria-hidden="true"
			>
				<div class="modal-dialog modal-lg">
					<div class="modal-content">
						<div class="modal-header">
							<h1 class="modal-title fs-5" id="exampleModalLabel">
								Inbound Academy Assessement Test
							</h1>
							<button
								type="button"
								class="btn-close"
								data-bs-dismiss="modal"
								aria-label="Close"
							></button>
						</div>
						<div class="modal-body">
							<div class="candidate_dt">
								<span>
									<span>Candidate Name: </span>
									<strong>{auth?.user?.FirstName ? auth.user.FirstName : ""}</strong>
								</span>

								<span>
									<span>Number of Questions Attempted: </span>
									<strong>{UserReport.total_attempted}</strong>
								</span>
							</div>
							<div class="qustions_result_table qustions_result_tablev">
								<table width="100%" border="0" cellSpacing="0">
									<thead>
										<tr>
											{/* <th>Sr No.</th> */}
											<th width="50%">Subject</th>
											<th width="20%">Attempted</th>
											<th width="20%">Correct Answer</th>
											<th width="10%">Marks</th>
										</tr>
									</thead>
									<tbody>
										{UserReport?.categoryResult &&
											Object.entries(UserReport.categoryResult).map(
												([key, value]) => (
													<>
														<tr>
															{/* <td>{++index}</td> */}

															<td className="cat-blog">{value.name}</td>
															<td className="txtAlnCtr">
																{value?.attempted ? value?.attempted : 0}
															</td>
															<td className="txtAlnCtr">
																{value?.correctAnswer
																	? value?.correctAnswer
																	: 0}
															</td>
															<td className="txtAlnCtr">
																{value?.correctAnswer
																	? value?.correctAnswer
																	: 0}
															</td>
														</tr>
													</>
												)
											)}
									</tbody>
									<tr className="total_row">
										<td>Total</td>
										<td className="txtAlnCtr">{UserReport.total_attempted}</td>
										<td className="txtAlnCtr">
											{UserReport.correctAnswerCount}
										</td>
										<td className="txtAlnCtr">{UserReport.marks_Obtained}</td>
									</tr>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default ExamList;
