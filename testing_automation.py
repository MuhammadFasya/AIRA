"""
AIRA Testing Automation Script
Helps automate some black-box testing tasks
"""

import json
from datetime import datetime

class TestCase:
    def __init__(self, test_id, module, description, expected_result):
        self.test_id = test_id
        self.module = module
        self.description = description
        self.expected_result = expected_result
        self.status = "Not Tested"
        self.actual_result = ""
        self.screenshot = ""
        self.timestamp = None
    
    def update_result(self, status, actual_result, screenshot=""):
        self.status = status
        self.actual_result = actual_result
        self.screenshot = screenshot
        self.timestamp = datetime.now().isoformat()
    
    def to_dict(self):
        return {
            "test_id": self.test_id,
            "module": self.module,
            "description": self.description,
            "expected_result": self.expected_result,
            "status": self.status,
            "actual_result": self.actual_result,
            "screenshot": self.screenshot,
            "timestamp": self.timestamp
        }

class BugReport:
    def __init__(self, bug_id, title, severity, module):
        self.bug_id = bug_id
        self.title = title
        self.severity = severity  # Critical, High, Medium, Low
        self.module = module
        self.steps_to_reproduce = []
        self.expected_behavior = ""
        self.actual_behavior = ""
        self.screenshot = ""
        self.root_cause = ""
        self.fix_applied = ""
        self.status = "Open"  # Open, In Progress, Fixed, Verified
        self.created_at = datetime.now().isoformat()
        self.fixed_at = None
    
    def add_step(self, step):
        self.steps_to_reproduce.append(step)
    
    def mark_fixed(self, fix_description):
        self.fix_applied = fix_description
        self.status = "Fixed"
        self.fixed_at = datetime.now().isoformat()
    
    def to_dict(self):
        return {
            "bug_id": self.bug_id,
            "title": self.title,
            "severity": self.severity,
            "module": self.module,
            "steps_to_reproduce": self.steps_to_reproduce,
            "expected_behavior": self.expected_behavior,
            "actual_behavior": self.actual_behavior,
            "screenshot": self.screenshot,
            "root_cause": self.root_cause,
            "fix_applied": self.fix_applied,
            "status": self.status,
            "created_at": self.created_at,
            "fixed_at": self.fixed_at
        }

class TestingReport:
    def __init__(self, project_name="AIRA Mental Health Chatbot"):
        self.project_name = project_name
        self.test_cases = []
        self.bugs = []
        self.created_at = datetime.now().isoformat()
    
    def add_test_case(self, test_case):
        self.test_cases.append(test_case)
    
    def add_bug(self, bug):
        self.bugs.append(bug)
    
    def get_summary(self):
        total = len(self.test_cases)
        passed = sum(1 for tc in self.test_cases if tc.status == "Passed")
        failed = sum(1 for tc in self.test_cases if tc.status == "Failed")
        not_tested = sum(1 for tc in self.test_cases if tc.status == "Not Tested")
        
        return {
            "total_test_cases": total,
            "passed": passed,
            "failed": failed,
            "not_tested": not_tested,
            "pass_rate": f"{(passed/total*100):.2f}%" if total > 0 else "0%",
            "total_bugs": len(self.bugs),
            "critical_bugs": sum(1 for b in self.bugs if b.severity == "Critical"),
            "high_bugs": sum(1 for b in self.bugs if b.severity == "High"),
            "medium_bugs": sum(1 for b in self.bugs if b.severity == "Medium"),
            "low_bugs": sum(1 for b in self.bugs if b.severity == "Low"),
            "fixed_bugs": sum(1 for b in self.bugs if b.status == "Fixed" or b.status == "Verified")
        }
    
    def save_to_json(self, filename="testing_results.json"):
        data = {
            "project_name": self.project_name,
            "created_at": self.created_at,
            "summary": self.get_summary(),
            "test_cases": [tc.to_dict() for tc in self.test_cases],
            "bugs": [bug.to_dict() for bug in self.bugs]
        }
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        
        print(f"Testing report saved to {filename}")
    
    def generate_markdown_report(self, filename="TESTING_RESULTS.md"):
        summary = self.get_summary()
        
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(f"# {self.project_name} - Testing Results\n\n")
            f.write(f"**Testing Date**: {self.created_at}\n\n")
            
            # Summary
            f.write("## Executive Summary\n\n")
            f.write(f"- **Total Test Cases**: {summary['total_test_cases']}\n")
            f.write(f"- **Passed**: {summary['passed']} ✅\n")
            f.write(f"- **Failed**: {summary['failed']} ❌\n")
            f.write(f"- **Not Tested**: {summary['not_tested']} ⬜\n")
            f.write(f"- **Pass Rate**: {summary['pass_rate']}\n\n")
            
            f.write(f"- **Total Bugs Found**: {summary['total_bugs']}\n")
            f.write(f"  - Critical: {summary['critical_bugs']}\n")
            f.write(f"  - High: {summary['high_bugs']}\n")
            f.write(f"  - Medium: {summary['medium_bugs']}\n")
            f.write(f"  - Low: {summary['low_bugs']}\n")
            f.write(f"- **Bugs Fixed**: {summary['fixed_bugs']}\n\n")
            
            # Test Cases
            f.write("## Test Cases\n\n")
            for tc in self.test_cases:
                status_icon = "✅" if tc.status == "Passed" else "❌" if tc.status == "Failed" else "⬜"
                f.write(f"### {tc.test_id}: {tc.description}\n")
                f.write(f"- **Module**: {tc.module}\n")
                f.write(f"- **Status**: {status_icon} {tc.status}\n")
                f.write(f"- **Expected**: {tc.expected_result}\n")
                if tc.actual_result:
                    f.write(f"- **Actual**: {tc.actual_result}\n")
                if tc.screenshot:
                    f.write(f"- **Screenshot**: {tc.screenshot}\n")
                f.write("\n")
            
            # Bugs
            if self.bugs:
                f.write("## Bugs Found\n\n")
                for bug in self.bugs:
                    f.write(f"### Bug #{bug.bug_id}: {bug.title}\n")
                    f.write(f"- **Severity**: {bug.severity}\n")
                    f.write(f"- **Module**: {bug.module}\n")
                    f.write(f"- **Status**: {bug.status}\n")
                    f.write(f"- **Steps to Reproduce**:\n")
                    for i, step in enumerate(bug.steps_to_reproduce, 1):
                        f.write(f"  {i}. {step}\n")
                    f.write(f"- **Expected Behavior**: {bug.expected_behavior}\n")
                    f.write(f"- **Actual Behavior**: {bug.actual_behavior}\n")
                    if bug.root_cause:
                        f.write(f"- **Root Cause**: {bug.root_cause}\n")
                    if bug.fix_applied:
                        f.write(f"- **Fix Applied**: {bug.fix_applied}\n")
                    f.write("\n")
        
        print(f"Markdown report saved to {filename}")


# Example usage
if __name__ == "__main__":
    # Create testing report
    report = TestingReport()
    
    # Add Authentication test cases
    tc1 = TestCase(
        "TC-1.1.1",
        "Authentication",
        "Login with Valid Credentials",
        "Successful login, redirect to Home page, token stored"
    )
    report.add_test_case(tc1)
    
    tc2 = TestCase(
        "TC-1.1.2",
        "Authentication",
        "Login with Invalid Email",
        "Login fails, error toast displayed"
    )
    report.add_test_case(tc2)
    
    tc3 = TestCase(
        "TC-1.1.3",
        "Authentication",
        "Login with Invalid Password",
        "Login fails, error toast displayed"
    )
    report.add_test_case(tc3)
    
    # Add Chat test cases
    tc4 = TestCase(
        "TC-1.2.1",
        "Chat",
        "Send Simple Message",
        "Message sent, AI response received within 3-5 seconds"
    )
    report.add_test_case(tc4)
    
    tc5 = TestCase(
        "TC-1.2.2",
        "Chat",
        "Send Empty Message",
        "Nothing happens or validation prevents sending"
    )
    report.add_test_case(tc5)
    
    # Add Settings test cases
    tc6 = TestCase(
        "TC-1.3.1",
        "Settings",
        "Theme Toggle (Light to Dark)",
        "Theme changes, all components update, preference saved"
    )
    report.add_test_case(tc6)
    
    tc7 = TestCase(
        "TC-1.3.3",
        "Settings",
        "Language Switch to Indonesian",
        "All UI text changes to Indonesian, toast displayed"
    )
    report.add_test_case(tc7)
    
    # Add Responsive Design test cases
    tc8 = TestCase(
        "TC-1.4.1",
        "UI/Responsive",
        "Mobile View (320px - 640px)",
        "Layout fits screen, no horizontal scrolling, buttons properly sized"
    )
    report.add_test_case(tc8)
    
    print("\n=== AIRA Testing Report Initialized ===")
    print(f"Total Test Cases: {len(report.test_cases)}")
    print("\nTo record test results:")
    print("1. Run each test case manually")
    print("2. Update results using: tc.update_result('Passed', 'Actual result', 'screenshot.png')")
    print("3. Save report using: report.save_to_json()")
    print("4. Generate markdown: report.generate_markdown_report()")
    print("\nExample:")
    print("  tc1.update_result('Passed', 'Login successful, redirected to home', 'login_success.png')")
    print("  report.save_to_json()")
    print("  report.generate_markdown_report()")
    
    # Example: Update one test case result
    tc1.update_result(
        "Passed",
        "Login successful with alex@aira.com, redirected to Home page, token stored in localStorage, welcome toast displayed",
        "screenshots/login_success.png"
    )
    
    # Example: Add a bug
    bug1 = BugReport(
        "BUG-001",
        "Toast notification z-index issue on mobile",
        "Medium",
        "UI"
    )
    bug1.add_step("Open app on mobile device (320px width)")
    bug1.add_step("Login with valid credentials")
    bug1.add_step("Observe toast notification position")
    bug1.expected_behavior = "Toast should appear clearly at top of screen"
    bug1.actual_behavior = "Toast partially hidden behind navbar or off-screen"
    bug1.screenshot = "screenshots/toast_mobile_bug.png"
    bug1.root_cause = "z-index conflict with navbar, positioning issue on small screens"
    
    report.add_bug(bug1)
    
    # Save reports
    report.save_to_json("testing_results.json")
    report.generate_markdown_report("TESTING_RESULTS.md")
    
    # Print summary
    print("\n=== Testing Summary ===")
    summary = report.get_summary()
    for key, value in summary.items():
        print(f"{key.replace('_', ' ').title()}: {value}")
