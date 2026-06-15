import random

class ReportGenerator:
    @staticmethod
    def generate_report(answers: dict):
        """
        Generates a career report based on assessment answers.
        answers is a dict of {question_id: score} where score is 1-5.
        """
        
        # 1. Calculate Scores
        scores = {
            "RIASEC": ReportGenerator._calculate_riasec(answers),
            "MBTI": ReportGenerator._calculate_mbti(answers),
            "BigFive": ReportGenerator._calculate_big5(answers),
            "MultipleIntelligence": ReportGenerator._calculate_mi(answers)
        }
        
        # 2. Match Careers
        # We'll use RIASEC as the primary driver for career matching
        top_careers = ReportGenerator._match_careers(scores)
        
        # 3. Generate Summary
        summary = ReportGenerator._generate_summary(scores)
        
        return {
            "scores": scores,
            "top_careers": top_careers,
            "summary": summary
        }

    @staticmethod
    def _calculate_riasec(answers):
        # RIASEC: 60 questions, 10 per category
        categories = {
            "Realistic": 0,
            "Investigative": 0,
            "Artistic": 0,
            "Social": 0,
            "Enterprising": 0,
            "Conventional": 0
        }
        
        # Simple mapping based on question ID prefix/index
        # Realistic: 1-10, Investigative: 11-20, Artistic: 21-30, 
        # Social: 31-40, Enterprising: 41-50, Conventional: 51-60
        for q_id, score in answers.items():
            if not q_id.startswith("riasec_"): continue
            try:
                num = int(q_id.split("_")[1])
                if 1 <= num <= 10: categories["Realistic"] += score
                elif 11 <= num <= 20: categories["Investigative"] += score
                elif 21 <= num <= 30: categories["Artistic"] += score
                elif 31 <= num <= 40: categories["Social"] += score
                elif 41 <= num <= 50: categories["Enterprising"] += score
                elif 51 <= num <= 60: categories["Conventional"] += score
            except: continue
        
        # Normalize to 0-100 (max possible score is 10 * 5 = 50)
        for cat in categories:
            categories[cat] = (categories[cat] / 50.0) * 100
            
        return categories

    @staticmethod
    def _calculate_mbti(answers):
        # MBTI: 70 questions
        # E vs I: 1-18, S vs N: 19-36, T vs F: 37-52, J vs P: 53-70
        # For each pair, odd = First, even = Second (based on questions.ts labels)
        dims = {"EI": 0, "SN": 0, "TF": 0, "JP": 0}
        counts = {"EI": 0, "SN": 0, "TF": 0, "JP": 0}
        
        for q_id, score in answers.items():
            if not q_id.startswith("mbti_"): continue
            try:
                num = int(q_id.split("_")[1])
                val = score - 3 # -2 to +2
                if 1 <= num <= 18:
                    dims["EI"] += val if num % 2 != 0 else -val
                    counts["EI"] += 1
                elif 19 <= num <= 36:
                    dims["SN"] += -val if num % 2 != 0 else val # 19=S, 20=N (Odd=S=Negative in this logic)
                    counts["SN"] += 1
                elif 37 <= num <= 52:
                    dims["TF"] += val if num % 2 != 0 else -val # 37=T, 38=F
                    counts["TF"] += 1
                elif 53 <= num <= 70:
                    dims["JP"] += val if num % 2 != 0 else -val # 53=J, 54=P
                    counts["JP"] += 1
            except: continue
            
        type_str = ""
        type_str += "E" if dims["EI"] >= 0 else "I"
        type_str += "S" if dims["SN"] < 0 else "N" # Sensing is odd questions
        # Actually let's just make it simpler for the prototype
        # Looking at questions.ts: 19=Concrete(S), 20=Future(N). 
        # If score 19 is high -> S. If score 20 is high -> N.
        # My logic above: 19 is val (Positive), 20 is -val (Negative). 
        # So sum > 0 means S.
        
        # Let's redo to be safer
        e_score, i_score = 0, 0
        s_score, n_score = 0, 0
        t_score, f_score = 0, 0
        j_score, p_score = 0, 0
        
        for q_id, score in answers.items():
            if not q_id.startswith("mbti_"): continue
            num = int(q_id.split("_")[1])
            if 1 <= num <= 18:
                if num % 2 != 0: e_score += score
                else: i_score += score
            elif 19 <= num <= 36:
                if num % 2 != 0: s_score += score
                else: n_score += score
            elif 37 <= num <= 52:
                if num % 2 != 0: t_score += score
                else: f_score += score
            elif 53 <= num <= 70:
                if num % 2 != 0: j_score += score
                else: p_score += score
                
        res = ""
        res += "E" if e_score >= i_score else "I"
        res += "S" if s_score >= n_score else "N"
        res += "T" if t_score >= f_score else "F"
        res += "J" if j_score >= p_score else "P"
        return res

    @staticmethod
    def _calculate_big5(answers):
        traits = {"Openness": 0, "Conscientiousness": 0, "Extraversion": 0, "Agreeableness": 0, "Neuroticism": 0}
        for q_id, score in answers.items():
            if not q_id.startswith("big5_"): continue
            num = int(q_id.split("_")[1])
            if 1 <= num <= 10: traits["Openness"] += score
            elif 11 <= num <= 20: traits["Conscientiousness"] += score
            elif 21 <= num <= 30: traits["Extraversion"] += score
            elif 31 <= num <= 40: traits["Agreeableness"] += score
            elif 41 <= num <= 50: traits["Neuroticism"] += score
            
        for t in traits:
            traits[t] = (traits[t] / 50.0) * 100
        return traits

    @staticmethod
    def _calculate_mi(answers):
        types = ["Linguistic", "Logical", "Spatial", "Musical", "Kinesthetic", "Interpersonal", "Intrapersonal", "Naturalistic"]
        scores = {t: 0 for t in types}
        for q_id, score in answers.items():
            if not q_id.startswith("mi_"): continue
            num = int(q_id.split("_")[1])
            idx = (num - 1) // 5
            if 0 <= idx < len(types):
                scores[types[idx]] += score
        
        for t in scores:
            scores[t] = (scores[t] / 25.0) * 100
        return scores

    @staticmethod
    def _match_careers(scores):
        # RIASEC based matching
        riasec = scores["RIASEC"]
        # Sort categories by score
        sorted_cats = sorted(riasec.items(), key=lambda x: x[1], reverse=True)
        primary = sorted_cats[0][0]
        secondary = sorted_cats[1][0]
        
        career_pool = {
            "Realistic": [
                {"title": "Civil Engineer", "salary": "$88,000", "demand": "Moderate"},
                {"title": "Mechanical Engineer", "salary": "$90,000", "demand": "Moderate"},
                {"title": "Software Developer", "salary": "$110,000", "demand": "Very High"},
                {"title": "Electrician", "salary": "$60,000", "demand": "High"},
                {"title": "Aircraft Pilot", "salary": "$130,000", "demand": "Moderate"}
            ],
            "Investigative": [
                {"title": "Data Scientist", "salary": "$120,000", "demand": "High"},
                {"title": "Medical Scientist", "salary": "$95,000", "demand": "High"},
                {"title": "AI Research Scientist", "salary": "$150,000", "demand": "Very High"},
                {"title": "Software Architect", "salary": "$140,000", "demand": "High"},
                {"title": "Physicist", "salary": "$125,000", "demand": "Moderate"}
            ],
            "Artistic": [
                {"title": "UX Designer", "salary": "$95,000", "demand": "High"},
                {"title": "Architect", "salary": "$82,000", "demand": "Moderate"},
                {"title": "Creative Director", "salary": "$110,000", "demand": "Moderate"},
                {"title": "Film Editor", "salary": "$75,000", "demand": "High"},
                {"title": "Graphic Designer", "salary": "$55,000", "demand": "Moderate"}
            ],
            "Social": [
                {"title": "Clinical Psychologist", "salary": "$85,000", "demand": "High"},
                {"title": "Education Administrator", "salary": "$98,000", "demand": "Moderate"},
                {"title": "HR Manager", "salary": "$120,000", "demand": "High"},
                {"title": "Social Worker", "salary": "$50,000", "demand": "High"},
                {"title": "Registered Nurse", "salary": "$77,000", "demand": "Very High"}
            ],
            "Enterprising": [
                {"title": "Product Manager", "salary": "$130,000", "demand": "High"},
                {"title": "Marketing Manager", "salary": "$140,000", "demand": "High"},
                {"title": "Financial Advisor", "salary": "$90,000", "demand": "Moderate"},
                {"title": "Sales Director", "salary": "$150,000", "demand": "High"},
                {"title": "Entrepreneur", "salary": "Variable", "demand": "N/A"}
            ],
            "Conventional": [
                {"title": "Accountant", "salary": "$75,000", "demand": "Moderate"},
                {"title": "Database Administrator", "salary": "$100,000", "demand": "Moderate"},
                {"title": "Financial Analyst", "salary": "$85,000", "demand": "High"},
                {"title": "Actuary", "salary": "$110,000", "demand": "High"},
                {"title": "Business Operations Manager", "salary": "$115,000", "demand": "Moderate"}
            ]
        }
        
        # Mix careers from primary and secondary RIASEC traits
        matches = []
        matches.extend(career_pool.get(primary, [])[:6])
        matches.extend(career_pool.get(secondary, [])[:4])
        
        # Add match scores (simulated)
        for i, m in enumerate(matches):
            m["match_score"] = 98 - (i * 2) - random.randint(0, 2)
            
        return matches

    @staticmethod
    def _generate_summary(scores):
        mbti = scores["MBTI"]
        riasec_top = sorted(scores["RIASEC"].items(), key=lambda x: x[1], reverse=True)[0][0]
        mi_top = sorted(scores["MultipleIntelligence"].items(), key=lambda x: x[1], reverse=True)[0][0]
        
        return (f"Your {mbti} personality type, combined with strong {riasec_top} interests and {mi_top} intelligence, "
                f"suggests you excel in environments that value both analytical depth and practical application. "
                f"You likely enjoy solving complex problems and seeing tangible results from your work.")
