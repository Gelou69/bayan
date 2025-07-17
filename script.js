
        // --- Configuration ---
        const INACTIVITY_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes of inactivity
        const WARNING_TIME_MS = 30 * 1000;          // Show warning 30 seconds before logout
        const LOGOUT_URL = '/logout';                // *** IMPORTANT: Replace with your actual server-side logout URL ***

        // --- Variables to manage timers and state ---
        let activityTimer;            // Main timer for inactivity detection
        let warningTimer;             // Timer for the warning countdown
        let countdownInterval;        // Interval for updating the countdown display
        let lastActivityTime = new Date(); // To display last activity
        let countdownSeconds = WARNING_TIME_MS / 1000; // Initial countdown value

        // --- DOM Elements ---
        const logoutModal = document.getElementById('logout-modal');
        const stayLoggedInButton = document.getElementById('stayLoggedInBtn');
        const countdownDisplay = document.getElementById('countdown');
        const lastActivitySpan = document.getElementById('last-activity');

        // --- Functions ---

        /**
         * Function to log out the user.
         * IMPORTANT: This should trigger a server-side logout process.
         */
        function performLogout() {
            clearAllTimers();
            console.log("Logging out due to inactivity...");
            alert("You have been logged out due to inactivity.");
            // Redirect to your server-side logout endpoint
            window.location.href = LOGOUT_URL;
        }

        /**
         * Resets the main inactivity timer.
         * Called on user activity.
         */
        function resetActivityTimer() {
            console.log("Activity detected. Timer reset.");
            clearTimeout(activityTimer);
            hideWarningModal(); // Hide modal if it was open
            lastActivityTime = new Date();
            updateLastActivityDisplay();
            startActivityTimer(); // Restart the timer
        }

        /**
         * Starts the main inactivity timer.
         */
        function startActivityTimer() {
            activityTimer = setTimeout(() => {
                showWarningModal(); // Show warning before actual logout
            }, INACTIVITY_TIMEOUT_MS - WARNING_TIME_MS); // Trigger warning before full timeout
        }

        /**
         * Displays the logout warning modal and starts its countdown.
         */
        function showWarningModal() {
            console.log("Showing logout warning...");
            logoutModal.style.display = 'flex'; // Use flex to center the modal content
            countdownSeconds = WARNING_TIME_MS / 1000; // Reset countdown
            updateCountdownDisplay(); // Initial display

            // Start the countdown timer for the warning
            warningTimer = setTimeout(performLogout, WARNING_TIME_MS);
            countdownInterval = setInterval(updateCountdownDisplay, 1000); // Update every second
        }

        /**
         * Hides the logout warning modal and clears its related timers.
         */
        function hideWarningModal() {
            console.log("Hiding logout warning...");
            logoutModal.style.display = 'none';
            clearTimeout(warningTimer);
            clearInterval(countdownInterval);
        }

        /**
         * Updates the countdown display in the modal.
         */
        function updateCountdownDisplay() {
            countdownDisplay.textContent = countdownSeconds;
            if (countdownSeconds <= 0) {
                clearInterval(countdownInterval); // Stop updating once it reaches 0
            }
            countdownSeconds--;
        }

        /**
         * Updates the "Last activity" text.
         */
        function updateLastActivityDisplay() {
            const now = new Date();
            const diffMs = now - lastActivityTime;
            const diffSeconds = Math.floor(diffMs / 1000);
            const diffMinutes = Math.floor(diffSeconds / 60);

            if (diffSeconds < 5) {
                lastActivitySpan.textContent = 'Just now';
            } else if (diffSeconds < 60) {
                lastActivitySpan.textContent = `${diffSeconds} seconds ago`;
            } else {
                lastActivitySpan.textContent = `${diffMinutes} minutes ago`;
            }
        }


        /**
         * Clears all timers related to inactivity and warning.
         */
        function clearAllTimers() {
            clearTimeout(activityTimer);
            clearTimeout(warningTimer);
            clearInterval(countdownInterval);
        }

        // --- Event Listeners for Activity Detection ---
        document.addEventListener('mousemove', resetActivityTimer);
        document.addEventListener('keypress', resetActivityTimer);
        document.addEventListener('click', resetActivityTimer);
        document.addEventListener('scroll', resetActivityTimer); // Consider scroll as activity
        // Add more event listeners as needed for your application's specific interactions

        // --- Event Listener for "Stay Logged In" button ---
        stayLoggedInButton.addEventListener('click', () => {
            resetActivityTimer(); // Reset all timers and hide modal
        });

        // --- Initial Setup on Page Load ---
        window.onload = () => {
            resetActivityTimer(); // Start the timer when the page loads
            updateLastActivityDisplay(); // Initial display
            console.log("Auto logout script loaded. Inactivity timeout set to", INACTIVITY_TIMEOUT_MS / 1000 / 60, "minutes.");
            console.log("Warning will appear", WARNING_TIME_MS / 10, "seconds before logout.");
        };

        // --- Example: Simulate Activity (for testing) ---
        function simulateActivity() {
            console.log("Simulating user activity.");
            resetActivityTimer();
        }