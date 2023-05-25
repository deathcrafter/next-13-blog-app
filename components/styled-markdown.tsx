"use client";

import ReactMarkdown from "react-markdown";
import styled from "styled-components";

const StyledMarkdown = styled(ReactMarkdown)`
	* {
		overflow-wrap: break-word;
	}
	color: white;
	& p {
		font-size: 1rem;
		:nth-child(n) {
			padding-bottom: 1rem;
		}
	}
	& ul {
		list-style: square;
		margin-top: 10px;
		font-size: 1rem;
	}
	& li {
		padding-bottom: 2px;
	}
	// Prevent going outside the container
	& img {
		max-width: 100%;
		margin-top: 1rem;
	}
	& a {
		color: #7519ff;
		text-decoration: none;
		&:hover {
			text-decoration: underline;
		}
	}
	& h1,
	h2,
	h3,
	h4,
	h5 {
		margin-top: 1.5rem;
	}
`;

export default StyledMarkdown;
