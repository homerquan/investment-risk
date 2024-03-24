document.getElementById('context-btn').addEventListener('click', function() {
    var context = document.getElementById('context');
    var timestamp = document.getElementById('timestamp');
    var labels = document.querySelectorAll('.context-label');
    var display = context.style.display === 'none' ? 'block' : 'none';
    context.style.display = display;
    timestamp.style.display = display;
    labels.forEach(label => label.style.display = display);
});

document.getElementById('submit').addEventListener('click', function() {
    var goal = document.getElementById('goal');
    var context = document.getElementById('context');
    var timestamp = document.getElementById('timestamp');
    var submitBtn = document.getElementById('submit');
    var loadingStatus = document.getElementById('loading-status');

    if (!goal.value.trim() || goal.value.trim().split(/\s+/).length < 10) {
        alert('Please give a specific goal');
        return; // Stop execution if condition is met
    }

    // Disable inputs and show loading
    [goal, context, timestamp, submitBtn].forEach(elem => elem.disabled = true);
    loadingStatus.style.display = 'block';
    loadingStatus.innerHTML = '<p>Checking stock history...</p>';

    const updateStatus = (message, nextStep) => {
        setTimeout(() => {
            loadingStatus.innerHTML = `<p>${message}</p>`;
            if(nextStep) nextStep();
        }, 3000);
    };

    updateStatus('Checking annual report...', () => {
        updateStatus('Analysing...', () => {
            updateStatus('Finishing...', () => {
                fetch('http://localhost:3000/execute', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        goal: goal.value,
                        context: {
                            text: context.value,
                            timestamp: timestamp.value || time.value
                        }
                    }),
                })
                .then(response => response.json())
                .then(data => {
                    document.getElementById('response').innerHTML = `<p><strong>Summary:</strong> ${data.summary}</p>
                    <p><strong>Score:</strong> ${data.score} out of 5</p>
                    <p><strong>Risks:</strong></p>
                    <ul>${data.risks.map(risk => `<li><strong>${risk.name}:</strong> ${risk.details}</li>`).join('')}</ul>`;
                    document.getElementById('response').classList.add('show');
                    loadingStatus.style.display = 'none';
                    [goal, context, timestamp, submitBtn].forEach(elem => elem.disabled = false);
                })
                .catch((error) => {
                    console.error('Error:', error);
                    loadingStatus.innerHTML = `<p>Error fetching data. Please try again.</p>`;
                    [goal, context, timestamp, submitBtn].forEach(elem => elem.disabled = false);
                });
            });
        });
    });
});

function freezeInputs(freeze) {
    document.getElementById('goal').disabled = freeze;
    document.getElementById('context').disabled = freeze;
    document.getElementById('timestamp').disabled = freeze;
    document.getElementById('time').disabled = freeze;
    document.getElementById('submit').disabled = freeze;
}

function showLoader(show) {
    if (show) {
        document.getElementById('loader').classList.remove('hidden');
    } else {
        document.getElementById('loader').classList.add('hidden');
    }
}