import "./App.css";
import { useState } from "react";

function FeedbackForm({onSubmit}) {
  const [score, setScore] = useState("10");
  const [comment, setComment] = useState("");

  const isDisabled = Number(score) < 5 && comment.length <= 10;

  const textAreaPlaceholder = isDisabled
    ? "Please provide a comment explaining why the experience was not good. Minimum length is 10 characters."
    : "Optional feedback";

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({score, comment});
  };

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <fieldset>
          <h2>Feedback form</h2>
          <div className="Field">
            <label htmlFor="score">Score: {score} ⭐</label>
            <input
              id="score"
              role="input"
              value={score}
              onChange={(e) => {
                setScore(e.target.value);
              }}
              type="range"
              min="0"
              max="10"
            />
          </div>
          <div className="Field">
            <label htmlFor="comment">Comments:</label>
            <textarea
              id="comment"
              role="textarea"
              placeholder={textAreaPlaceholder}
              name="comment"
              value={comment}
              onChange={(e) => {
                setComment(e.target.value);
              }}
            />
          </div>
          <button id="submit" type="submit" role="button" disabled={isDisabled}>
            Submit
          </button>
        </fieldset>
      </form>
    </div>
  );
}

export default FeedbackForm;




//////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { fireEvent, render, screen } from "@testing-library/react";
import FeedbackForm from "./FeedbackForm";

describe("Feedback Form", () => {
  test("User is able to submit the form if the score is lower than 5 and additional feedback is provided", () => {

    const score = "3";
    const comment = "The pizza crust was too thick";
    const handleSubmit = jest.fn();
    render(<FeedbackForm onSubmit={handleSubmit} />);

    const input = screen.getByRole("input");
    fireEvent.change(input, { target: { value: "3" } });
    
    const textArea = screen.getByRole("textarea");
    fireEvent.change(textArea, {target: {value: "The pizza crust was too thick"}})

    const submitButton = screen.getByRole("button");
    fireEvent.click(submitButton);
    

    //assert
    expect(handleSubmit).toHaveBeenCalledWith({
      score,
      comment,
    });
  });

  test("User is able to submit the form if the score is higher than 5, without additional feedback", () => {
    const score = "9";
    const handleSubmit = jest.fn();
    render(<FeedbackForm onSubmit={handleSubmit} />);

    const input = screen.getByRole("input");
    fireEvent.change(input, { target: { value: "9" } })
    
    const textArea = screen.getByRole("textarea");
    fireEvent.change(textArea, { target: { value: "" } });

    const buttonSubmit = screen.getByRole("button");
    fireEvent.click(buttonSubmit)

    expect(handleSubmit).toHaveBeenCalledWith({
      score,
      comment: "",
    });
  });
});
