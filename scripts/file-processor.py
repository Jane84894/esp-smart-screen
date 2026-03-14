#!/usr/bin/env python3
"""简易文件内容提取器"""
import sys
import subprocess

def extract_text(filepath):
    """根据文件类型调用不同工具"""
    if filepath.endswith('.pdf'):
        result = subprocess.run(['pdftotext', filepath, '-'], capture_output=True, text=True)
        return result.stdout
    elif filepath.endswith('.docx'):
        result = subprocess.run(['docx2txt', filepath, '-'], capture_output=True, text=True)
        return result.stdout
    elif filepath.endswith('.xlsx'):
        result = subprocess.run(['xlsx2csv', filepath, '-'], capture_output=True, text=True)
        return result.stdout
    else:
        with open(filepath, 'r') as f:
            return f.read()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("用法：file-processor.py <文件路径>")
        sys.exit(1)
    print(extract_text(sys.argv[1]))
