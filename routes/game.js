function gameRoutes(app) {
    let goodAnswers = 0;
    let isGameOver = false;
    let callToAFriendUsed = false;
    let qustionToTheCrowdUsed = false;
    let halfOnHalfUsed = false;

    const questions =[
        {
            question: 'What is the best programming language in the world in my opinion?',
            answers: ['C++', 'JavaScript', 'Java', 'PHP'],
            correctAnswer: 1,
        },
        {
            question: 'Is this course cool?',
            answers: ["I don't know",' Yes', 'No', 'Can be'],
            correctAnswer: 1,
        },
        {
            question: 'Do you want to eat pizza?',
            answers: ['Yes', 'No thanks', "I'm on a diet", 'I prefer broccoli'],
            correctAnswer: 0,
        },
    ];

    app.get('/question', (req, res) => {
        if(goodAnswers === questions.length) {
            res.json({
                winner: true,
            })
        }else if (isGameOver) {
            res.json({
                loser: true,
            })
        }else {
            const nextQuestion = questions[goodAnswers];
            const {question, answers} = nextQuestion;

            res.json({
                question, answers,
            })
        }
    });

    app.post('/answer/:index', (req, res) => {

        if(isGameOver){
            res.json({
                loser: true,
            });
        }

        const {index} = req.params;
        const question = questions[goodAnswers];
        const isGoodAnswer = question.correctAnswer == Number(index);

        if(isGoodAnswer) {
            goodAnswers++;
        }else {
            isGameOver = true;
        };

        res.json({
            correct: isGoodAnswer,
            goodAnswers,
        })
    });

    app.get('/help/friend', (req, res) => {

        if(callToAFriendUsed) {
            return res.json({
                text: "This lifebuoy has already been used!"
            });
        };

        callToAFriendUsed = true;

        const doesFriendKnowAnswer = Math.random() < 0.5;
        const question = questions[goodAnswers];

        res.json({
            text: doesFriendKnowAnswer ? `Hmm, I think answer that ${question.answers[question.correctAnswer]}` : "Hmm ... I don't know",
        });
    });

    app.get('/help/half', (req, res) => {

        if(halfOnHalfUsed) {
            return res.json({
                text: "This lifebuoy has already been used!"
            });
        };

        halfOnHalfUsed = true;
        const question = questions[goodAnswers];

        const answersCopy = question.answers.filter((s, index) => (
            index !== question.correctAnswer
        ));

               
        answersCopy.splice(~~(Math.random() * answersCopy.length), 1);

        res.json({
           answerToRemove: answersCopy,
        });
    });

    app.get('/help/crowd', (req, res) => {
        

        if(qustionToTheCrowdUsed) {
            return res.json({
                text: "This lifebuoy has already been used!"
            });
        };

        qustionToTheCrowdUsed = true;

        const chart = [10, 20, 30, 40];

        for(let i = chart.length - 1; i > 0; i--){
            const change = Math.floor(Math.random() * 20 - 10);
            chart[i] += change;
            chart[i - 1] -= change;
        }

        const question = questions[goodAnswers];
        const {correctAnswer} = question;
        [chart[3], chart[correctAnswer]] = [chart[correctAnswer], chart[3]];

        res.json({
            chart,
        })
    });
};

module.exports = gameRoutes;