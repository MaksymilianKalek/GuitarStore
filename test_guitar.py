from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import time

driver = webdriver.Chrome()

driver.get("http://localhost:5000/")
assert "Maks" in driver.title
elem = driver.find_element_by_css_selector("body > div > div > div > div > a.btn.btn-primary.btn-block.mb-2")
time.sleep(1)
elem.click()
elem = driver.find_element_by_css_selector("#email")
time.sleep(1)
elem.send_keys("mail")
elem = driver.find_element_by_css_selector("#password")
time.sleep(1)
elem.send_keys("password")
elem = driver.find_element_by_css_selector("body > div > div > div > div > form > button")
time.sleep(1)
elem.click()
elem = driver.find_element_by_css_selector("#navbarColor01 > ul > li:nth-child(3) > a")
time.sleep(1)
elem.click()
elem = driver.find_element_by_css_selector("body > div > div > div:nth-child(25) > div > div > div > div > div > a")
time.sleep(1)
elem.click()
elem = driver.find_element_by_css_selector("#navbarDropdown")
time.sleep(1)
elem.click()
elem = driver.find_element_by_css_selector("#navbarColor01 > ul > li.nav-item.dropdown.show > div > a:nth-child(1)")
time.sleep(1)
elem.click()
elem = driver.find_element_by_css_selector("body > div > div > div:nth-child(5) > a")
time.sleep(1)
elem.click()
elem = driver.find_element_by_css_selector("#city")
time.sleep(1)
elem.send_keys("Poznań")
elem = driver.find_element_by_css_selector("#address")
time.sleep(1)
elem.send_keys("Sobek")
elem = driver.find_element_by_css_selector("#message")
time.sleep(1)
elem.send_keys("Love ya")
elem = driver.find_element_by_css_selector("body > div > div > div > div > form > fieldset > button")
time.sleep(1)
elem.click()

