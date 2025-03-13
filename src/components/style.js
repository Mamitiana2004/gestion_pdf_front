const fileInput = {
	container: {
        width:"400px",
		alignSelf: "stretch",
		display: "flex",
		flexDirection: "column",
		gap: "10px",
		alignItems: "flex-start",
		justifyContent: "flex-start",
		fontSize: "14px"
	},
	title_container: {
		alignSelf: "stretch",
		position: "relative",
		fontSize: "16px",
	},
	title: {
		fontWeight: 700,
		lineHeight: "25.2px"
	},
	drag_drop: {
		alignSelf: "stretch",
		display: "flex",
		flexDirection: "column",
		gap: "10px",
		borderRadius: "16px",
		backgroundColor: "#f5f5f5",
		border: "2px dashed #bdbdbd",
		boxSizing: "border-box",
		height: "196px",
		overflow: "hidden",
		flexShrink: "0",
		padding: "16px",
		alignItems: "center",
		justifyContent: "center",
		textAlign: "center",
		cursor: "pointer"
	},
	cloud: {
		position: "relative",
		width: "40px",
		height: "40px",
	},
	preview: {
		height: "100%"
	}
}

export {fileInput};