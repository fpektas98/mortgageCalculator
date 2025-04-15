document.addEventListener('DOMContentLoaded', function() {
    // Set up event listeners
    document.querySelector('.calculate-btn').addEventListener('click', validateForm);
    
    // Input restrictions
    document.querySelector('.mortgage-amount input').addEventListener('input', function(e) {
      this.value = this.value.replace(/[^0-9,]/g, '');
    });
    
    document.querySelector('.mortgage-term input').addEventListener('input', function(e) {
      this.value = this.value.replace(/[^0-9]/g, '');
    });
    
    document.querySelector('.interest-rate input').addEventListener('input', function(e) {
      // Allow only one decimal point
      if ((e.target.value.match(/\./g) || []).length > 1) {
        e.target.value = e.target.value.slice(0, -1);
      }
      this.value = this.value.replace(/[^0-9.]/g, '');
    });
  });
  
  function validateForm() {
    // Get all input fields
    const mortgageAmount = document.querySelector('.mortgage-amount input');
    const mortgageTerm = document.querySelector('.mortgage-term input');
    const interestRate = document.querySelector('.interest-rate input');
    const mortgageType = document.querySelector('input[name="mortgageType"]:checked');
  
    // Get all input containers and form-check divs
    const mortgageAmountContainer = document.querySelector('.mortgage-amount');
    const mortgageTermContainer = document.querySelector('.mortgage-term');
    const interestRateContainer = document.querySelector('.interest-rate');
    const formChecks = document.querySelectorAll('.form-check');
  
    // Reset error states
    mortgageAmountContainer.classList.remove('error');
    mortgageTermContainer.classList.remove('error');
    interestRateContainer.classList.remove('error');
    formChecks.forEach(formCheck => formCheck.classList.remove('error'));
    document.querySelectorAll('.error-message').forEach(msg => {
      msg.classList.remove('active');
      msg.textContent = 'This field is required';
    });
  
    let hasError = false;
  
    // Validate Mortgage Amount
    if (!mortgageAmount.value.trim()) {
      mortgageAmountContainer.classList.add('error');
      mortgageAmountContainer.nextElementSibling.classList.add('active');
      hasError = true;
    } else if (!/^[0-9,]+$/.test(mortgageAmount.value)) {
      mortgageAmountContainer.classList.add('error');
      mortgageAmountContainer.nextElementSibling.textContent = 'Only numbers and commas allowed';
      mortgageAmountContainer.nextElementSibling.classList.add('active');
      hasError = true;
    }
  
    // Validate Mortgage Term
    if (!mortgageTerm.value.trim()) {
      mortgageTermContainer.classList.add('error');
      mortgageTermContainer.nextElementSibling.classList.add('active');
      hasError = true;
    } else if (!/^[0-9]+$/.test(mortgageTerm.value)) {
      mortgageTermContainer.classList.add('error');
      mortgageTermContainer.nextElementSibling.textContent = 'Only whole numbers allowed';
      mortgageTermContainer.nextElementSibling.classList.add('active');
      hasError = true;
    }
  
    // Validate Interest Rate
    if (!interestRate.value.trim()) {
      interestRateContainer.classList.add('error');
      interestRateContainer.nextElementSibling.classList.add('active');
      hasError = true;
    } else if (!/^[0-9.]+$/.test(interestRate.value)) {
      interestRateContainer.classList.add('error');
      interestRateContainer.nextElementSibling.textContent = 'Only numbers and decimal point allowed';
      interestRateContainer.nextElementSibling.classList.add('active');
      hasError = true;
    }
  
    // Validate Mortgage Type
    if (!mortgageType) {
      formChecks.forEach(formCheck => formCheck.classList.add('error'));
      formChecks[0].parentElement.querySelector('.error-message').textContent = 'Please select an option';
      formChecks[0].parentElement.querySelector('.error-message').classList.add('active');
      hasError = true;
    }
  
    if (!hasError) {
      calculateMortgage(
        parseFloat(mortgageAmount.value.replace(/,/g, '')),
        parseInt(mortgageTerm.value),
        parseFloat(interestRate.value),
        mortgageType.value
      );
    }
  }
  
  function calculateMortgage(amount, term, rate, type) {
    // Convert annual rate to monthly and term to months
    const monthlyRate = rate / 100 / 12;
    const payments = term * 12;
  
    let monthlyPayment;
    if (type === 'repayment') {
      // Repayment mortgage calculation
      monthlyPayment = amount * 
        (monthlyRate * Math.pow(1 + monthlyRate, payments)) / 
        (Math.pow(1 + monthlyRate, payments) - 1);
    } else {
      // Interest only mortgage calculation
      monthlyPayment = amount * monthlyRate;
    }
  
    const totalRepayment = monthlyPayment * payments;
  
    // Display results
    displayResults(monthlyPayment, totalRepayment);
  }
  
  function displayResults(monthlyPayment, totalRepayment) {
    const resultRight = document.querySelector('.result-right');
    resultRight.innerHTML = `
      <div class="results-content">
        <h5>Your results</h5>
        <p class="results-description">Your results are shown below based on the information you provided. 
        To adjust the results, edit the form and click "calculate repayments" again.</p>
        
        <div class="results-divider"></div>
        
        <h6 class="results-subtitle">Your monthly repayments</h6>
        <div class="monthly-payment">£${monthlyPayment.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
        
        <div class="total-repayment">
          <span>Total you'll repay over the term</span>
          <span>£${totalRepayment.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
        </div>
      </div>
    `;
  }
  
  function clearForm() {
    // Clear input fields
    document.querySelector('.mortgage-amount input').value = '';
    document.querySelector('.mortgage-term input').value = '';
    document.querySelector('.interest-rate input').value = '';
    
    // Clear radio selections
    document.querySelectorAll('input[name="mortgageType"]').forEach(radio => {
      radio.checked = false;
    });
    
    // Reset errors
    document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    document.querySelectorAll('.error-message').forEach(msg => {
      msg.classList.remove('active');
      msg.textContent = 'This field is required';
    });
    
    // Reset results display
    document.querySelector('.result-right').innerHTML = `
      <img src="images/illustration-empty.svg" alt="">
      <h5>Results Shown Here</h5>
      <p>Complete the form and click "Calculate Repayments" to see what your monthly repayments will be.</p>
    `;
  }