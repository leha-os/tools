from docx import Document
from docx.shared import Pt, Cm, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml.ns import qn
from docx.oxml import OxmlElement

doc = Document()

# ===== THIẾT LẬP TRANG =====
for section in doc.sections:
    section.top_margin = Cm(2.5)
    section.bottom_margin = Cm(2.5)
    section.left_margin = Cm(3.0)
    section.right_margin = Cm(2.0)

# ===== STYLE MẶC ĐỊNH =====
style = doc.styles['Normal']
style.font.name = 'Times New Roman'
style.font.size = Pt(12)
style.element.rPr.rFonts.set(qn('w:eastAsia'), 'Times New Roman')

def set_cell_border(cell, **kwargs):
    tc = cell._tc
    tcPr = tc.get_or_add_tcPr()
    tcBorders = OxmlElement('w:tcBorders')
    for edge in ('start', 'top', 'end', 'bottom', 'left', 'right'):
        if edge in kwargs:
            edge_data = kwargs.get(edge)
            tag = 'w:{}'.format(edge)
            element = OxmlElement(tag)
            for key in edge_data:
                element.set(qn('w:{}'.format(key)), str(edge_data[key]))
            tcBorders.append(element)
    tcPr.append(tcBorders)

def add_heading_center(text, size=16, bold=True, color=None):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = p.add_run(text)
    run.bold = bold
    run.font.size = Pt(size)
    run.font.name = 'Times New Roman'
    if color:
        run.font.color.rgb = color
    return p

def add_heading_left(text, size=13, bold=True, color=None, space_before=12):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p.paragraph_format.space_before = Pt(space_before)
    p.paragraph_format.space_after = Pt(6)
    run = p.add_run(text)
    run.bold = bold
    run.font.size = Pt(size)
    run.font.name = 'Times New Roman'
    if color:
        run.font.color.rgb = color
    return p

def add_para(text, size=12, bold=False, italic=False, indent=0, align='left', space_after=6):
    p = doc.add_paragraph()
    if align == 'justify':
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    elif align == 'center':
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    else:
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    if indent:
        p.paragraph_format.left_indent = Cm(indent)
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.line_spacing = 1.3
    run = p.add_run(text)
    run.bold = bold
    run.italic = italic
    run.font.size = Pt(size)
    run.font.name = 'Times New Roman'
    return p

def add_bullet(text, size=12, indent=0.5):
    p = doc.add_paragraph(style='List Bullet')
    p.paragraph_format.left_indent = Cm(indent)
    p.paragraph_format.space_after = Pt(3)
    run = p.add_run(text)
    run.font.size = Pt(size)
    run.font.name = 'Times New Roman'
    return p

# ===== HEADER =====
header = doc.sections[0].header
hp = header.paragraphs[0]
hp.text = "QUY CHẾ HOẠT ĐỘNG WEPLUS⁺ GROUP"
hp.alignment = WD_ALIGN_PARAGRAPH.CENTER
for run in hp.runs:
    run.font.size = Pt(9)
    run.font.name = 'Times New Roman'
    run.italic = True

# ===== FOOTER =====
footer = doc.sections[0].footer
fp = footer.paragraphs[0]
fp.text = "Mã số: QC-WP-2026-01  |  Trang "
fp.alignment = WD_ALIGN_PARAGRAPH.CENTER
for run in fp.runs:
    run.font.size = Pt(9)
    run.font.name = 'Times New Roman'

# Thêm số trang
fldChar1 = OxmlElement('w:fldChar')
fldChar1.set(qn('w:fldCharType'), 'begin')
instrText = OxmlElement('w:instrText')
instrText.set(qn('xml:space'), 'preserve')
instrText.text = 'PAGE'
fldChar2 = OxmlElement('w:fldChar')
fldChar2.set(qn('w:fldCharType'), 'end')
run = fp.add_run()
run._r.append(fldChar1)
run._r.append(instrText)
run._r.append(fldChar2)

# ===== TIÊU ĐỀ ĐẦU =====
add_heading_center("WEPLUS⁺ GROUP", size=14, bold=True)
add_heading_center("HỆ SINH THÁI TGROUP", size=11, bold=False)
doc.add_paragraph()
add_heading_center("QUY CHẾ HOẠT ĐỘNG", size=20, bold=True, color=RGBColor(0x1F, 0x3A, 0x5F))
add_heading_center("WEPLUS⁺ GROUP", size=16, bold=True, color=RGBColor(0x1F, 0x3A, 0x5F))
doc.add_paragraph()

p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
run = p.add_run("(Ban hành kèm theo Quyết định số: ......../QĐ-WP  ngày ...... tháng ...... năm 2026)")
run.italic = True
run.font.size = Pt(11)
run.font.name = 'Times New Roman'

doc.add_paragraph()
add_para("Số hiệu: QC-WP-2026-01", size=11, italic=True, align='center')

# Đường kẻ ngang
p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
run = p.add_run("─" * 60)
run.font.color.rgb = RGBColor(0x1F, 0x3A, 0x5F)
run.font.size = Pt(11)

doc.add_paragraph()

# ===== GIỚI THIỆU =====
add_para("WePlus⁺ Group thuộc hệ sinh thái Tgroup, gồm 5 đơn vị thành viên đang hoạt động: "
         "ePlus⁺, Engage⁺, Enabler⁺, GolfCare⁺, Nguyễn Mộc (khối Quảng cáo).",
         align='justify', space_after=8)

add_para("WePlus⁺ Group hoạt động dựa trên Bộ Quy chế chung gồm 23 điều, chia 4 nhóm: "
         "Quy định chung (Điều 1–4), Quy tắc làm việc chung (Điều 5–12), "
         "Nghỉ phép & chế độ nghỉ (Điều 13–16), Đãi ngộ & phúc lợi (Điều 17–23).",
         align='justify', space_after=8)

add_para("Khung Quy chế thống nhất 3 mức:", bold=True, align='justify', space_after=4)

# Bảng 3 mức
table = doc.add_table(rows=4, cols=3)
table.style = 'Table Grid'
table.alignment = WD_TABLE_ALIGNMENT.CENTER
headers = ["Mức", "Nội dung", "Ví dụ"]
data = [
    ["Mức A", "Áp dụng chung toàn Group, đơn vị không được sửa đổi", "Thời giờ làm việc, chấm công, phép năm 12 ngày"],
    ["Mức B", "Khung chung, đơn vị linh hoạt trong phạm vi cho phép và báo cáo Phòng Nhân sự & Pháp chế", "Làm việc từ xa (tối đa 02 ngày/tháng), ngân sách sinh nhật (mức trần), định mức công tác phí"],
    ["Mức C", "Đơn vị tự quy định theo đặc thù, nộp Phòng Nhân sự & Pháp chế lưu hồ sơ", "Hoa hồng và thưởng dự án theo từng đơn vị"],
]
for j, h in enumerate(headers):
    cell = table.rows[0].cells[j]
    cell.text = h
    for paragraph in cell.paragraphs:
        paragraph.alignment = WD_ALIGN_PARAGRAPH.CENTER
        for run in paragraph.runs:
            run.bold = True
            run.font.size = Pt(10)
            run.font.name = 'Times New Roman'

for i, row_data in enumerate(data, 1):
    for j, val in enumerate(row_data):
        cell = table.rows[i].cells[j]
        cell.text = val
        for paragraph in cell.paragraphs:
            for run in paragraph.runs:
                run.font.size = Pt(10)
                run.font.name = 'Times New Roman'

doc.add_paragraph()

# ===== TIÊU ĐỀ QUY CHẾ =====
add_heading_center("QUY CHẾ HOẠT ĐỘNG WEPLUS⁺ GROUP", size=18, bold=True, color=RGBColor(0x1F, 0x3A, 0x5F))
doc.add_paragraph()

# Đường kẻ ngang
p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
run = p.add_run("═" * 60)
run.font.color.rgb = RGBColor(0x1F, 0x3A, 0x5F)
run.font.size = Pt(11)
doc.add_paragraph()

# ===== HÀM THÊM ĐIỀU =====
def add_dieu(so_dieu, ten_dieu, noi_dung_list):
    """Thêm một Điều vào document"""
    add_heading_left(f"ĐIỀU {so_dieu}. {ten_dieu.upper()}", size=13, bold=True,
                     color=RGBColor(0x1F, 0x3A, 0x5F), space_before=14)
    for item in noi_dung_list:
        if item.startswith("•"):
            add_bullet(item[1:].strip())
        else:
            add_para(item, align='justify', space_after=5)

def add_muc(text):
    """Thêm tiêu đề mục (nhóm điều)"""
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(18)
    p.paragraph_format.space_after = Pt(10)
    run = p.add_run(text)
    run.bold = True
    run.font.size = Pt(14)
    run.font.name = 'Times New Roman'
    run.font.color.rgb = RGBColor(0x1F, 0x3A, 0x5F)

# =====================================================================
# NHÓM 1: QUY ĐỊNH CHUNG
# =====================================================================
add_muc("PHẦN I. QUY ĐỊNH CHUNG")

add_dieu(1, "Phạm vi điều chỉnh và đối tượng áp dụng", [
    "1. Quy chế này quy định thống nhất về tổ chức quản lý và chính sách đãi ngộ áp dụng trong toàn WePlus⁺ Group.",
    "2. Quy chế này áp dụng đối với toàn thể nhân viên làm việc tại các đơn vị thành viên: Engage⁺, ePlus⁺, Enabler⁺, GolfCare⁺, Nguyễn Mộc (khối Quảng Cáo).",
    "3. Mọi quy định nội bộ của đơn vị thành viên không được trái với các nội dung thuộc Mức A của Quy chế này.",
])

add_dieu(2, "Nguyên tắc thống nhất", [
    "Các nội dung của Quy chế được phân thành ba mức thống nhất:",
])

# Bảng nguyên tắc
table2 = doc.add_table(rows=4, cols=3)
table2.style = 'Table Grid'
table2.alignment = WD_TABLE_ALIGNMENT.CENTER
headers2 = ["Mức", "Nội dung", "Ví dụ"]
data2 = [
    ["Mức A — Chuẩn chung bắt buộc", "Toàn WePlus⁺ áp dụng thống nhất; đơn vị thành viên không được sửa đổi.", "Thời giờ làm việc, chấm công, phép năm 12 ngày."],
    ["Mức B — Khung chung", "WePlus⁺ quy định khung và biên độ; đơn vị thành viên được linh hoạt trong phạm vi cho phép và báo cáo Phòng Nhân sự & Pháp chế.", "Làm việc từ xa (tối đa 02 ngày/tháng), ngân sách sinh nhật (mức trần), định mức công tác phí."],
    ["Mức C — Đặc thù đơn vị", "Đơn vị thành viên tự quy định phù hợp đặc thù kinh doanh; nộp Phòng Nhân sự & Pháp chế lưu hồ sơ.", "Hoa hồng và thưởng dự án theo từng đơn vị."],
]
for j, h in enumerate(headers2):
    cell = table2.rows[0].cells[j]
    cell.text = h
    for paragraph in cell.paragraphs:
        paragraph.alignment = WD_ALIGN_PARAGRAPH.CENTER
        for run in paragraph.runs:
            run.bold = True
            run.font.size = Pt(10)
            run.font.name = 'Times New Roman'

for i, row_data in enumerate(data2, 1):
    for j, val in enumerate(row_data):
        cell = table2.rows[i].cells[j]
        cell.text = val
        for paragraph in cell.paragraphs:
            for run in paragraph.runs:
                run.font.size = Pt(10)
                run.font.name = 'Times New Roman'

doc.add_paragraph()

add_dieu(3, "Thẩm quyền ban hành, sửa đổi, bổ sung", [
    "1. Hội đồng quản trị là cấp có thẩm quyền duy nhất ban hành, sửa đổi, bổ sung Quy chế này.",
    "2. Phòng Nhân sự & Pháp chế chủ trì rà soát định kỳ, tổng hợp các đề xuất sửa đổi để trình Hội đồng quản trị xem xét, quyết định.",
    "3. Giám đốc đơn vị thành viên được ban hành quy định nội bộ đối với các nội dung thuộc Mức B, Mức C; không được ban hành nội dung trái với Mức A.",
])

add_dieu(4, "Hiệu lực thi hành và rà soát định kỳ", [
    "1. Quy chế này có hiệu lực kể từ ngày ký ban hành (số hiệu dự kiến: QC-WP-2026-01; ngày hiệu lực do Hội đồng quản trị điền khi phê duyệt).",
    "2. Định kỳ 12 tháng một lần, Phòng Nhân sự & Pháp chế chủ trì rà soát, đề xuất sửa đổi cho phù hợp với tình hình thực tế.",
    "3. Kể từ ngày Quy chế có hiệu lực, các quy định riêng của từng đơn vị hết hiệu lực đối với những nội dung đã được Quy chế điều chỉnh; các nội dung đặc thù của đơn vị (Mức C) tiếp tục thực hiện và gửi Phòng Nhân sự & Pháp chế để lưu hồ sơ.",
])

# =====================================================================
# NHÓM 2: QUY TẮC LÀM VIỆC CHUNG
# =====================================================================
add_muc("PHẦN II. QUY TẮC LÀM VIỆC CHUNG")

add_dieu(5, "Thời giờ làm việc", [
    "1. Thời giờ làm việc chuẩn: từ 09 giờ 00 đến 18 giờ 00 các ngày làm việc trong tuần; thời gian nghỉ trưa từ 12 giờ 00 đến 13 giờ 00 (không tính vào thời giờ làm việc).",
    "2. Nhân viên được đến muộn tối đa 30 phút so với giờ chuẩn nếu đã đăng ký trước với quản lý trực tiếp, với điều kiện vẫn bảo đảm đủ 08 giờ làm việc trong ngày.",
    "3. Ngày tham gia tổ chức sự kiện: thực hiện theo lịch điều phối của dự án; áp dụng chế độ nghỉ bù quy định tại Điều 14.",
])

add_dieu(6, "Chấp hành thời giờ làm việc", [
    "1. Giờ làm việc được ghi nhận qua hệ thống chấm công; vào làm sau 10 giờ 00 hoặc ra về trước 15 giờ 00 phải được quản lý trực tiếp chấp thuận.",
    "2. Đi muộn, về sớm, vắng mặt không lý do được tổng hợp hằng tháng và xử lý theo quy định về kỷ luật lao động tại Điều 11.",
    "3. Các trường hợp vi phạm khác được xử lý theo quy trình tại Điều 11.",
])

add_dieu(7, "Chấm công", [
    "1. Nhân viên thực hiện chấm công vào và ra bằng vân tay tại cửa ra vào trụ sở làm việc.",
    "2. Việc chấm công được phân công như sau: nhân viên — hệ thống ghi nhận tự động; quản lý trực tiếp — xác nhận các trường hợp giải trình (đi muộn, làm thêm giờ, công tác); Phòng Nhân sự — tổng hợp, chốt bảng công và chuyển tính lương.",
])

add_dieu(8, "Trang phục", [
    "1. Nhân viên mặc trang phục lịch sự, gọn gàng, phù hợp môi trường làm việc chuyên nghiệp.",
    "2. Không mặc: trang phục quá mỏng, váy quá ngắn, áo ba lỗ, áo cúp ngực (nữ); quần ngắn, áo ba lỗ, áo sát nách, dép lê (nam).",
])

add_dieu(9, "Nội quy văn phòng", [
    "1. Khi ra ngoài trong giờ làm việc phải thông báo cho quản lý trực tiếp.",
    "2. Giữ gìn vệ sinh và trả lại nguyên trạng phòng họp, pantry, khu vực dùng chung sau khi sử dụng; tài liệu, thiết bị dùng chung để đúng nơi quy định.",
    "3. Sử dụng và bảo quản đúng cách thiết bị, tài sản công ty được giao; người ra về cuối cùng kiểm tra tắt điện, điều hòa, khóa cửa.",
    "4. Giữ trật tự tại khu vực làm việc chung, tôn trọng không gian tập trung của đồng nghiệp; chuẩn mực trong trang phục và giao tiếp khi tiếp khách, đối tác tại văn phòng.",
])

add_dieu(10, "Bảo mật thông tin và dữ liệu", [
    "1. Không tiết lộ thông tin khách hàng, tài chính, nhân sự, chiến lược kinh doanh ra bên ngoài khi chưa được ủy quyền bằng văn bản của người có thẩm quyền.",
    "2. Không sử dụng tài sản trí tuệ, dữ liệu, mối quan hệ khách hàng của công ty cho mục đích cá nhân hoặc cho đơn vị khác.",
    "3. Bảo vệ dữ liệu cá nhân, dữ liệu khách hàng và dữ liệu nội bộ theo quy định pháp luật; không sao chép, phát tán hoặc đưa dữ liệu nội bộ ra khỏi hệ thống của công ty khi chưa được phê duyệt.",
    "4. Có trách nhiệm bảo mật tài khoản, mật khẩu các thiết bị công ty được giao; không cài đặt phần mềm không rõ nguồn gốc.",
    "5. Khi phát hiện dấu hiệu rò rỉ thông tin hoặc sự cố dữ liệu, báo ngay cho quản lý trực tiếp và Phòng Nhân sự & Pháp chế.",
    "6. Khi chấm dứt hợp đồng lao động: bàn giao đầy đủ dữ liệu, thiết bị; nghĩa vụ bảo mật chi tiết được quy định trong hợp đồng lao động hoặc thỏa thuận bảo mật riêng.",
    "7. Vi phạm Điều này được xử lý theo quy định tại Điều 11; trường hợp gây thiệt hại phải bồi thường theo quy định pháp luật.",
])

add_dieu(11, "Xử lý vi phạm", [
    "1. Tùy tính chất, mức độ vi phạm, đơn vị áp dụng biện pháp xử lý phù hợp theo quy định pháp luật và Quy chế này, bao gồm nhắc nhở, yêu cầu khắc phục hoặc xử lý kỷ luật lao động.",
    "2. Các hình thức kỷ luật lao động gồm: khiển trách; kéo dài thời hạn nâng lương không quá 06 tháng; cách chức; sa thải.",
    "3. Việc xử lý kỷ luật lao động phải đúng căn cứ, trình tự, thủ tục và bảo đảm quyền giải trình của người lao động theo quy định pháp luật.",
])

add_dieu(12, "An toàn lao động và xử lý sự cố", [
    "1. Nhân viên tuân thủ các quy định về phòng cháy, chữa cháy, an toàn điện và thoát hiểm tại nơi làm việc; tham gia đầy đủ các buổi tập huấn, diễn tập khi được yêu cầu.",
    "2. Giữ gìn vệ sinh, an toàn khu vực làm việc; không tự ý di chuyển, tháo gỡ thiết bị an toàn, phòng cháy, chữa cháy.",
    "3. Khi xảy ra sự cố (tai nạn lao động, cháy nổ, mất điện, sự cố an ninh, an toàn thông tin): ưu tiên bảo đảm an toàn con người, báo ngay cho quản lý trực tiếp và bộ phận liên quan, bảo vệ hiện trường, tài sản của công ty.",
    "4. Không tự ý xử lý sự cố vượt quá thẩm quyền, chức năng của mình; phối hợp đầy đủ khi đơn vị điều tra, khắc phục sự cố.",
])

# =====================================================================
# NHÓM 3: NGHỈ PHÉP & CHẾ ĐỘ NGHỈ
# =====================================================================
add_muc("PHẦN III. NGHỈ PHÉP & CHẾ ĐỘ NGHỈ")

add_dieu(13, "Thủ tục nghỉ phép", [
    "1. Thời hạn báo trước (trừ trường hợp đột xuất): nghỉ từ 01 đến 02 ngày, báo trước ít nhất 03 ngày làm việc; nghỉ từ 03 đến 05 ngày, báo trước ít nhất 07 ngày; nghỉ trên 05 ngày, báo trước ít nhất 14 ngày.",
    "2. Hình thức đăng ký: biểu mẫu tại tab Cổng nghỉ phép của Sổ tay.",
    "3. Để bảo đảm hoạt động liên tục, nhân viên chủ động sắp xếp kế hoạch nghỉ phép với quản lý trực tiếp; không quá 50% nhân sự của một nhóm cùng nghỉ trong một thời điểm, trừ trường hợp đặc biệt được Giám đốc chấp thuận.",
])

add_dieu(14, "Làm việc từ xa và nghỉ bù sự kiện", [
    "1. Tham gia tổ chức sự kiện vào ngày nghỉ hằng tuần được ghi nhận làm thêm giờ theo quy định pháp luật. Đơn vị và nhân viên thỏa thuận hình thức bù đắp: nghỉ bù từ 0,5 đến 01 ngày trong tuần kế tiếp hoặc hưởng chế độ làm thêm giờ theo luật, do quản lý trực tiếp xác nhận theo lịch sự kiện. [Mức B]",
    "2. Làm việc từ xa [Mức B]: tối đa 02 ngày/tháng, báo trước ít nhất 01 ngày cho quản lý trực tiếp; đơn vị phân bổ phù hợp đặc thù công việc.",
])

add_dieu(15, "Nghỉ việc riêng hưởng nguyên lương", [])

# Bảng nghỉ việc riêng
table3 = doc.add_table(rows=6, cols=2)
table3.style = 'Table Grid'
table3.alignment = WD_TABLE_ALIGNMENT.CENTER
data3 = [
    ["Trường hợp", "Chế độ"],
    ["Bản thân kết hôn", "03 ngày; mừng 1.000.000 đồng"],
    ["Con, cha, mẹ, anh, chị, em ruột kết hôn", "01 ngày"],
    ["Tang chế (cha, mẹ, vợ, chồng, con)", "03 ngày; vòng hoa chia buồn và 1.000.000 đồng"],
    ["Nhân viên nữ sinh con", "06 tháng theo quy định pháp luật; mừng 1.000.000 đồng"],
    ["Nhân viên nam có vợ sinh con", "05–07 ngày theo quy định pháp luật; mừng 1.000.000 đồng"],
]
for i, row_data in enumerate(data3):
    for j, val in enumerate(row_data):
        cell = table3.rows[i].cells[j]
        cell.text = val
        for paragraph in cell.paragraphs:
            if i == 0:
                paragraph.alignment = WD_ALIGN_PARAGRAPH.CENTER
            for run in paragraph.runs:
                run.font.size = Pt(11)
                run.font.name = 'Times New Roman'
                if i == 0:
                    run.bold = True

doc.add_paragraph()

add_dieu(16, "Nghỉ phép năm", [
    "1. Nhân viên làm đủ 12 tháng được hưởng 12 ngày phép năm. Nhân viên chưa làm đủ 12 tháng: mỗi tháng làm việc được hưởng 01 ngày phép.",
    "2. Cứ đủ 05 năm làm việc cho một đơn vị sử dụng lao động, nhân viên được tăng thêm 01 ngày phép năm.",
    "3. Mức phép năm quy định tại khoản 1 là mức tối thiểu theo pháp luật lao động; không đơn vị nào được quy định thấp hơn.",
])

# =====================================================================
# NHÓM 4: ĐÃI NGỘ & PHÚC LỢI
# =====================================================================
add_muc("PHẦN IV. ĐÃI NGỘ & PHÚC LỢI")

add_dieu(17, "Hợp đồng lao động", [
    "1. Thời gian thử việc, tiền lương thử việc và việc ký hợp đồng lao động chính thức thực hiện theo Điều 24, 25, 26 Bộ luật Lao động 2019.",
    "2. Khi chấm dứt hợp đồng lao động, nhân viên có trách nhiệm bàn giao đầy đủ công việc, tài sản, dữ liệu cho người tiếp nhận theo hướng dẫn của quản lý trực tiếp, hoàn tất trước ngày nghỉ việc.",
])

add_dieu(18, "Tiền lương", [
    "1. Tiền lương được chi trả bằng hình thức chuyển khoản qua ngân hàng HDBank, trong khoảng thời gian từ ngày 01 đến ngày 10 của tháng kế tiếp.",
    "2. Tiền lương, phụ cấp và các khoản thu nhập khác của nhân viên là thông tin bảo mật của đơn vị; nhân viên không tiết lộ cho bên thứ ba khi chưa được sự đồng ý của đơn vị, trừ trường hợp pháp luật có quy định khác.",
])

add_dieu(19, "Phát triển nhân sự", [
    "1. Công ty xây dựng lộ trình phát triển nghề nghiệp cho từng nhóm vị trí, làm cơ sở cho việc đánh giá, bổ nhiệm và quy hoạch nhân sự.",
    "2. Nhân viên được đánh giá hiệu quả công việc định kỳ, làm căn cứ xem xét tăng lương, thưởng, bổ nhiệm và đào tạo.",
    "3. Công ty tổ chức hoặc cử nhân viên tham gia các chương trình đào tạo, bồi dưỡng nâng cao chuyên môn, kỹ năng phù hợp với yêu cầu công việc.",
    "4. Nhân viên chủ động đề xuất nhu cầu đào tạo, phát triển bản thân với quản lý trực tiếp và Phòng Nhân sự.",
])

add_dieu(20, "Phúc lợi", [])

# Bảng phúc lợi
table4 = doc.add_table(rows=4, cols=2)
table4.style = 'Table Grid'
table4.alignment = WD_TABLE_ALIGNMENT.CENTER
data4 = [
    ["Phúc lợi", "Mức chi"],
    ["Khám sức khỏe định kỳ", "1.200.000 đồng/người/năm"],
    ["Gắn kết đội ngũ", "3.000.000 đồng/người/năm"],
    ["Sinh nhật (đề xuất mới)", "Nhân viên 300.000 đồng · Quản lý 500.000 đồng; tổ chức chung ngày 10 hằng tháng"],
]
for i, row_data in enumerate(data4):
    for j, val in enumerate(row_data):
        cell = table4.rows[i].cells[j]
        cell.text = val
        for paragraph in cell.paragraphs:
            if i == 0:
                paragraph.alignment = WD_ALIGN_PARAGRAPH.CENTER
            for run in paragraph.runs:
                run.font.size = Pt(11)
                run.font.name = 'Times New Roman'
                if i == 0:
                    run.bold = True

doc.add_paragraph()

add_dieu(21, "Thưởng dự án [Mức C]", [
    "1. Chế độ thưởng dự án thực hiện theo quy định nội bộ của từng đơn vị thành viên, phù hợp với đặc thù kinh doanh của đơn vị.",
    "2. Đơn vị thành viên xây dựng quy chế thưởng dự án của đơn vị mình, trình Hội đồng quản trị phê duyệt trước khi ban hành và áp dụng.",
    "3. Không áp dụng một thang thưởng chung cho toàn Group.",
])

add_dieu(22, "Công tác phí [Mức B]", [
    "1. Ăn uống (ngày công tác tỉnh): nhân viên 180.000 đồng; quản lý 250.000 đồng; giám đốc 300.000 đồng (ngày/người). Ngày tham gia tổ chức sự kiện: công ty bố trí ăn uống theo thực tế, không áp dụng định mức.",
    "2. Khách sạn: nhân viên 350.000 đồng; quản lý 500.000 đồng; giám đốc 700.000 đồng (đêm).",
    "3. Đón tiễn sân bay: thanh toán theo chi phí thực tế, tối đa 100.000 đồng/chiều; không thanh toán thêm trong trường hợp đã sử dụng xe hoặc ứng dụng của công ty.",
    "4. Đi lại trong tỉnh: trần 150.000 đồng/ngày; ưu tiên sử dụng ứng dụng công nghệ có hóa đơn; chỉ thuê xe máy khi ứng dụng không khả dụng và được quản lý trực tiếp chấp thuận.",
    "5. Grab/Be phục vụ công việc: thống nhất 01 ứng dụng theo hợp đồng của công ty; hạn mức hằng tháng: giám đốc 1.500.000 đồng; quản lý/trưởng nhóm 1.000.000 đồng; nhân viên theo từng chuyến được phê duyệt.",
    "6. Định mức tại Điều này là khung chuẩn của Group; đơn vị thành viên được điều chỉnh linh hoạt theo đặc thù từng dự án trong phạm vi khung cho phép và báo cáo Phòng Nhân sự & Pháp chế.",
])

add_dieu(23, "Trách nhiệm thi hành", [
    "1. Phòng Nhân sự & Pháp chế chịu trách nhiệm hướng dẫn, đôn đốc thực hiện Quy chế này; tổng hợp các vướng mắc phát sinh để báo cáo Hội đồng quản trị xem xét, quyết định.",
])

# ===== KẾT THÚC =====
doc.add_paragraph()
p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
run = p.add_run("─" * 60)
run.font.color.rgb = RGBColor(0x1F, 0x3A, 0x5F)
run.font.size = Pt(11)

doc.add_paragraph()
add_heading_center("TM. HỘI ĐỒNG QUẢN TRỊ", size=12, bold=True)
add_heading_center("CHỦ TỊCH", size=12, bold=True)
doc.add_paragraph()
doc.add_paragraph()
add_heading_center("(Ký, ghi rõ họ tên và đóng dấu)", size=10, italic=True)

# ===== LƯU FILE =====
doc.save("Quy_che_hoat_dong_WePlus_Group.docx")
print("✅ Đã tạo file: Quy_che_hoat_dong_WePlus_Group.docx")