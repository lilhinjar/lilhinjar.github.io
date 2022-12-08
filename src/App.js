import React, { useEffect, useState } from "react";
import "./App.css";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Modal,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { questionsMass } from "./mock";

function App() {
  const [selectedQuestion, setSelectedQuestion] = useState();

  const [selectedAnswer, setSelectedAnswer] = useState();

  const [selectedCell, setSelectedCell] = useState();

  const [questions, setQuestions] = useState(questionsMass);

  const wordsMass = ["A", "Б", "В", "Г", "Д", "Е", "Ж", "З", "И", "К"];

  const [open, setOpen] = React.useState(false);
  const [isFirstMotion, setIsFirstMotion] = useState(true);
  const [timer, setTimer] = useState(60);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setTimer(60);
  };

  const generateField = (indexes) => {
    if (!questions) return;
    const mass = [];
    let newQuestions = questions;
    for (let i = 0; i < 10; i++) {
      mass.push([]);
      for (let b = 0; b < 10; b++) {
        const isShipField = !!indexes.find((elem) => elem === i * 10 + b + 1);
        if (isShipField) {
          const questionIndex = Math.floor(Math.random() * questions.length);

          const question = questions[questionIndex];
          mass[i].push({
            isShip: true,
            status: "alive",
            id: i * 10 + b,
            questionId: question.id,
          });
          newQuestions = newQuestions.filter((que) => que.id !== question.id);
        } else {
          mass[i].push({
            isShip: false,
            status: "alive",
            id: i * 10 + b,
          });
        }
      }
    }

    setQuestions(newQuestions);

    return mass;
  };

  const [firstField, setFirstField] = useState();

  const [secondField, setSecondField] = useState();

  useEffect(() => {
    setFirstField(
      generateField([
        8, 9, 12, 15, 25, 29, 47, 48, 49, 51, 53, 61, 63, 73, 77, 83, 87, 90,
        91, 97,
      ])
    );
  }, []);

  useEffect(() => {
    if (firstField && !secondField) {
      setSecondField(
        generateField([
          4, 14, 16, 17, 19, 24, 29, 39, 41, 49, 51, 55, 68, 70, 78, 82, 95, 96,
          97, 99,
        ])
      );
    }
  }, [firstField]);

  const onCellClick = (cell, isRightAnswer, onChange) => {
    const newCell = { ...cell };
    if (cell.isShip) {
      console.log(cell);

      setSelectedQuestion(
        questionsMass.find((quest) => quest?.id === cell.questionId)
      );
      setSelectedCell(cell);
      handleOpen();
      // isRightAnswer ? (newCell.status = "dead") : (newCell.status = "miss");
    } else {
      newCell.status = "miss";

      if (isFirstMotion) {
        onChange(
          firstField.map((row) =>
            row.map((item) => (item.id === newCell.id ? newCell : item))
          )
        );
      } else {
        onChange(
          secondField.map((row) =>
            row.map((item) => (item.id === newCell.id ? newCell : item))
          )
        );
      }

      setIsFirstMotion(!isFirstMotion);
    }
  };

  const onAnswerConfirm = () => {
    const answer = selectedQuestion?.variants.find(
      (variant) => variant.id === +selectedAnswer
    );

    answer.isRight
      ? (selectedCell.status = "dead")
      : (selectedCell.status = "question-miss");

    if (isFirstMotion) {
      setFirstField(
        firstField.map((row) =>
          row.map((item) =>
            item.id === selectedCell?.id ? selectedCell : item
          )
        )
      );
    } else {
      setSecondField(
        secondField.map((row) =>
          row.map((item) =>
            item.id === selectedCell?.id ? selectedCell : item
          )
        )
      );
    }

    setSelectedAnswer(null);
    setSelectedCell(null);
    setSelectedQuestion(null);
    setIsFirstMotion(!isFirstMotion);

    handleClose();
  };

  useEffect(() => {
    if (open) {
      if (timer) {
        setTimeout(() => {
          setTimer((prevState) => prevState - 1);
        }, 1000);
      }

      if (!timer) {
        selectedCell.status = "miss";
        setFirstField(
          firstField.map((row) =>
            row.map((item) =>
              item.id === selectedCell?.id ? selectedCell : item
            )
          )
        );

        setSelectedAnswer(null);
        setSelectedCell(null);
        setSelectedQuestion(null);
        setIsFirstMotion(!isFirstMotion);

        handleClose();
      }
    }
  }, [timer, open, firstField, isFirstMotion, selectedCell]);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    p: 4,
    outline: "none",
  };

  return (
    <div>
      <div className="page-title">Морской бой</div>
      <div className="container">
        <div className="field-container">
          {firstField &&
            firstField.map((e, index) => (
              <div className="cell-container">
                {e.map((elem, i) => (
                  <div className="cell-all-container">
                    {index === 0 && <div className="cell-number">{i + 1}</div>}
                    <div className="cell-wrapper">
                      {i === 0 && (
                        <div className="cell-word">{wordsMass[index]}</div>
                      )}
                      <div
                        onClick={() => {
                          if (!isFirstMotion) return;
                          onCellClick(elem, true, setFirstField);
                        }}
                        className={
                          elem.status === "alive"
                            ? `cell cell-active ${
                                !isFirstMotion && "container-disabled"
                              }`
                            : `cell cell-dead ${
                                !isFirstMotion && "container-disabled"
                              }`
                        }
                      >
                        <div className={elem?.status} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          {!isFirstMotion ? <div className="container-disabled" /> : <></>}
          <div className="under-text">Игровое поле 1</div>
        </div>

        <div className="field-container">
          {secondField &&
            secondField.map((e, index) => (
              <div className="cell-container">
                {e.map((elem, i) => (
                  <div className="cell-all-container">
                    {index === 0 && <div className="cell-number">{i + 1}</div>}
                    <div className="cell-wrapper">
                      {i === 0 && (
                        <div className="cell-word">{wordsMass[index]}</div>
                      )}
                      <div
                        onClick={() => {
                          if (isFirstMotion) return;
                          onCellClick(elem, true, setSecondField);
                        }}
                        className={
                          elem.status === "alive"
                            ? `cell cell-active ${
                                isFirstMotion && "container-disabled"
                              }`
                            : `cell cell-dead ${
                                isFirstMotion && "container-disabled"
                              }`
                        }
                      >
                        <div className={elem?.status} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          <div className="under-text">Игровое поле 2</div>
        </div>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Времени на ответ {timer}
          </Typography>
          <Typography id="modal-modal-title" variant="h4" component="h2">
            Выберите правильный ответ
          </Typography>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {selectedQuestion?.text}
          </Typography>
          <FormControl>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="female"
              name="radio-buttons-group"
              value={selectedAnswer}
              onChange={(e) => {
                setSelectedAnswer(e.target.value);
              }}
            >
              {selectedQuestion?.variants?.map((variant) => (
                <FormControlLabel
                  value={variant.id}
                  control={<Radio />}
                  label={variant.text}
                />
              ))}
            </RadioGroup>
          </FormControl>
          <Button
            disabled={!selectedAnswer}
            className="submitBtn"
            variant="contained"
            onClick={() => onAnswerConfirm()}
          >
            Готово
          </Button>
        </Box>
      </Modal>
      <img
        className="img"
        src="https://i.pinimg.com/originals/a3/c0/a2/a3c0a2f191306bd42fde64f79334ecfd.jpg"
      />
    </div>
  );
}

export default App;
